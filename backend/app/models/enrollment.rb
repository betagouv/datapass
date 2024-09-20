# frozen_string_literal: true

require "csv"

class Enrollment < ApplicationRecord
  self.inheritance_column = "target_api"

  # enable Single Table Inheritance with target_api as discriminatory field
  class << self
    # ex: 'api_particulier' => Enrollment::ApiParticulier
    def find_sti_class(target_api)
      "Enrollment::#{target_api.underscore.classify}".constantize
    end

    def sti_class_for(type)
      find_sti_class(type)
    end

    # ex: Enrollment::ApiParticulier => 'api_particulier'
    def sti_name
      name.demodulize.underscore
    end

    def migrated_target_apis
      %w[
        api_entreprise
        api_particulier
        hubee_portail
        hubee_portail_dila
      ]
    end
  end

  validate :update_validation
  validate :submit_validation, on: :submit

  before_save :set_company_info, if: :will_save_change_to_organization_id?

  has_many :documents, as: :attachable
  accepts_nested_attributes_for :documents, allow_destroy: true
  has_many :events, dependent: :destroy
  belongs_to :copied_from_enrollment, class_name: :Enrollment, foreign_key: :copied_from_enrollment_id, optional: true
  validates :copied_from_enrollment, uniqueness: {
    scope: :copied_from_enrollment,
    conditions: -> { where.not(status: "archived") },
    allow_blank: true,
    message: "L’action que vous essayez de faire est impossible, car une copie de l’habilitation existe déjà. Pour continuer, veuillez utiliser cette copie."
  }
  belongs_to :previous_enrollment, class_name: :Enrollment, foreign_key: :previous_enrollment_id, optional: true

  has_many :team_members, dependent: :destroy
  accepts_nested_attributes_for :team_members
  has_many :users, through: :team_members

  validates :data_retention_period, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 999,
    allow_nil: true
  }

  has_many :opinions, dependent: :destroy
  has_one :active_opinion, -> { where(open: true) }, class_name: "Opinion"

  state_machine :status, initial: :draft, namespace: "status" do
    state :draft
    state :submitted
    state :changes_requested
    state :validated
    state :refused
    state :revoked
    state :archived

    event :notify do
      transition from: %i[draft changes_requested submitted], to: same
    end

    event :submit do
      transition from: %i[draft changes_requested], to: :submitted
    end

    event :refuse do
      transition from: %i[changes_requested submitted], to: :refused
    end

    event :revoke do
      transition from: :validated, to: :revoked
    end

    event :request_changes do
      transition from: :submitted, to: :changes_requested
    end

    event :archive do
      transition from: all - %i[archived validated], to: :archived, if: ->(enrollment) { !enrollment.reopening? }
    end

    event :validate do
      transition from: :submitted, to: :validated
    end

    event :reopen do
      transition from: :validated, to: :draft, if: ->(enrollment) { enrollment.can_reopen? }
    end

    before_transition do |enrollment, transition|
      enrollment.valid?(transition.event.to_sym)
    end

    before_transition from: %i[draft changes_requested], to: :submitted do |enrollment|
      if enrollment.technical_team_type == "software_company" && !enrollment.technical_team_value.match?(/^\d{14}$/)
        enrollment.notify_administrators_for_unknown_software_enrollment
      end
    end

    before_transition from: :draft, to: :submitted do |enrollment|
      enrollment.notify_subscribers_for_new_enrollment_submission
    end

    before_transition from: :changes_requested, to: :submitted do |enrollment|
      enrollment.notify_subscribers_for_enrollment_submission_after_changes_requested
    end

    after_transition from: :submitted, to: :validated do |enrollment|
      enrollment.snapshot!
    end

    after_transition do |enrollment, transition|
      entity = (transition.event.to_s == "validate") ? enrollment.last_snapshot : nil

      enrollment.events.create!(
        name: transition.event.to_s,
        user_id: transition.args.try(:[], 0).try(:[], :user_id),
        comment: transition.args.try(:[], 0).try(:[], :comment),
        entity:
      )
    end

    after_transition from: :submitted, to: :validated do |enrollment|
      bridge_disable = ENV.fetch("DISABLE_#{enrollment.target_api.upcase}_BRIDGE", "") == "True"

      if !bridge_disable && enrollment.bridge
        enrollment.bridge.call(
          enrollment
        )
      end
    end
  end

  def snapshot!
    self.last_validated_at = DateTime.now
    save

    create_snapshot!
  end

  def last_snapshot
    snapshots.order(created_at: :desc).limit(1).first
  end

  def reopening?
    last_validated_at.present? &&
      status != "validated"
  end

  def can_reopen?
    %w[
      api_captchetat
      api_cpr_pro_production
      api_cpr_pro_sandbox
      api_e_contacts_production
      api_e_contacts_sandbox
      api_e_pro_production
      api_e_pro_sandbox
      api_ensu_documents_production
      api_ensu_documents_sandbox
      api_ficoba_production
      api_ficoba_sandbox
      api_ficoba_unique
      api_hermes_production
      api_hermes_sandbox
      api_impot_particulier_fc_production
      api_impot_particulier_fc_sandbox
      api_impot_particulier_fc_unique
      api_impot_particulier_production
      api_impot_particulier_sandbox
      api_impot_particulier_unique
      api_imprimfip_production
      api_imprimfip_sandbox
      api_infinoe_production
      api_infinoe_sandbox
      api_infinoe_unique
      api_mire_production
      api_mire_sandbox
      api_ocfi_production
      api_ocfi_sandbox
      api_opale_production
      api_opale_sandbox
      api_r2p_production
      api_r2p_sandbox
      api_r2p_unique
      api_robf_production
      api_robf_sandbox
      api_satelit_production
      api_satelit_sandbox
      api_sfip_production
      api_sfip_sandbox
      api_sfip_unique
      api_tiers_de_prestation
      franceconnect
      hubee_portail
      hubee_portail_dila
    ].exclude?(target_api)
  end

  def mark_event_as_processed(event_name)
    unless ["notify", "submit"].include?(event_name)
      raise ArgumentError.new("Invalid event_name. Must be either 'notify' or 'submit'.")
    end

    should_be_mark_as_processed = events.where(
      name: event_name,
      processed_at: nil,
      user_id: demandeurs.pluck(:user_id)
    )
    should_be_mark_as_processed.each { |event| event.mark_as_processed }
  end

  def notify_events_from_demandeurs_count
    events.where(
      name: "notify",
      user_id: demandeurs.pluck(:user_id)
    ).count
  end

  def unprocessed_notify_events_from_demandeurs_count
    events.where(
      name: "notify",
      processed_at: nil,
      user_id: demandeurs.pluck(:user_id)
    ).count
  end

  def consulted_by_instructor?
    events.none? { |event| event[:name] == "submit" && event[:processed_at].nil? }
  end

  def requested_changes_have_been_done?
    return false if status != "submitted"
    events.any? { |event| event.name == "request_changes" }
  end

  def notify_event(event, **)
    notifier_class.new(self).public_send(event, **)
  end

  def notifier_class
    Kernel.const_get("#{target_api.classify}Notifier")
  rescue NameError
    BaseNotifier
  end

  def bridge
    Kernel.const_get("#{target_api.classify}Bridge")
  rescue NameError
    nil
  end

  def policy
    Kernel.const_get("Enrollment::#{target_api.classify}Policy")
  end

  def configuration
    @configuration ||= DataProviderConfigurations.instance.config_for(target_api)
  end

  def groups
    if configuration["groups"].blank?
      return []
    end

    configuration["groups"].reject { |k, v| (scopes & v["scopes"]).empty? }.keys
  end

  def concerned_roles(role_type)
    groups
      .map { |group| "#{target_api}:#{group}:#{role_type}" }
      .push("#{target_api}:#{role_type}")
  end

  def subscribers
    roles = concerned_roles("subscriber")
    User.where("roles && ARRAY[?]::varchar[]", roles)
  end

  def demandeurs
    team_members.where(type: "demandeur")
  end

  def responsable_traitement
    team_members.where(type: "responsable_traitement").first
  end

  def responsable_traitement_email
    team_members.where(type: "responsable_traitement").pluck(:email).first
  end

  def responsable_metier_email
    team_members.where(type: "responsable_metier").pluck(:email).first
  end

  def delegue_protection_donnees_email
    team_members.where(type: "delegue_protection_donnees").pluck(:email).first
  end

  def responsable_traitement_full_name
    team_member = team_members.where(type: "responsable_traitement").first
    [team_member["given_name"], team_member["family_name"]].join(" ")
  end

  def delegue_protection_donnees_full_name
    team_member = team_members.where(type: "delegue_protection_donnees").first
    [team_member["given_name"], team_member["family_name"]].join(" ")
  end

  def submitted_at
    events.where(name: "submit").order("created_at").last["created_at"]
  end

  def validated_at
    validated_events = events.where(name: "validate").order("created_at").limit(1)

    return if validated_events.empty?

    validated_events.last["created_at"]
  end

  def latest_event_date
    latest_event = events.order(created_at: :desc).limit(1).last

    return if latest_event.nil?

    latest_event["created_at"]
  end

  def copy(current_user)
    copied_enrollment = dup
    copied_enrollment.last_validated_at = nil
    copied_enrollment.status = :draft
    copied_enrollment.linked_token_manager_id = nil
    copied_enrollment.copied_from_enrollment = self
    team_members.each do |team_member|
      copied_team_member = team_member.dup
      copied_enrollment.team_members << copied_team_member
    end
    if copied_enrollment.save
      copied_enrollment.events.create(
        name: "copy",
        user_id: current_user.id,
        comment: "Habilitation d’origine : ##{id}"
      )
      documents.each do |document|
        copied_document = document.dup
        copied_document.attachment = File.open(document.file_content)
        copied_enrollment.documents << copied_document
      end
    end

    copied_enrollment
  end

  def team_members_json
    team_members
      .to_a.sort_by { |tm| tm.id }
      .to_json(methods: :type)
  end

  def demandeur_email
    team_members
      .to_a.select { |tm| tm.type == "demandeur" }
      .pluck(:email).first
  end

  def link
    "#{ENV.fetch("FRONT_HOST")}/#{target_api.tr("_", "-")}/#{id}"
  end

  def diff_with_associations
    res = diff(previous_changes)

    Enrollment
      .reflect_on_all_associations(:has_many)
      .map(&:name).each do |collection|
      res[collection.to_s] = {}

      send(collection).sort_by(&:id).each_with_index do |item, i|
        res[collection.to_s][i.to_s] = diff(item.previous_changes) unless item.previous_changes.empty?
      end

      if res[collection.to_s].empty?
        res.delete(collection.to_s)
      else
        res[collection.to_s]["_t"] = "a"
      end
    end

    res["_v"] = "3"
    res
  end

  def update_team_member_through_enrollment(id, params)
    params = {
      team_members_attributes: [
        {
          id: id,
          **params
        }
      ]
    }

    update!(params)
  end

  def notify_administrators_for_unknown_software_enrollment
    EnrollmentMailer.with(
      target_api: target_api,
      enrollment_id: id
    ).notification_email_unknown_software.deliver_later
  end

  def notify_subscribers_for_new_enrollment_submission
    EnrollmentMailer.with(
      target_api: target_api,
      enrollment_id: id,
      demandeur_email: demandeurs.pluck(:email).first
    ).new_enrollment_submission_notification_email.deliver_later
  end

  def notify_subscribers_for_enrollment_submission_after_changes_requested
    EnrollmentMailer.with(
      target_api: target_api,
      enrollment_id: id,
      demandeur_email: demandeurs.pluck(:email).first
    ).submission_after_changes_requested_notification_email.deliver_later
  end

  private

  def diff(changes)
    res = {}

    changes.each_key do |key|
      next if key.in? %w[updated_at created_at]

      previous_value = changes[key][0]
      new_value = changes[key][1]

      if previous_value.is_a? Hash
        res[key] = {}
        new_value.each_key do |sub_key|
          if previous_value[sub_key].nil?
            res[key][sub_key] = [new_value[sub_key]]
          elsif previous_value[sub_key] != new_value[sub_key]
            res[key][sub_key] = [previous_value[sub_key], new_value[sub_key]]
          end
        end
      else
        res[key] = if previous_value.nil?
          [new_value]
        else
          [previous_value, new_value]
        end
      end
    end

    res
  end

  protected

  def set_company_info
    # We need to get the siret from organization_id.
    # The only way to access this associations is through demandeur organizations.
    # Note that we cannot access team_member's 'user_id' property directly as team_member may not be persisted yet.
    demandeur_email = team_members.find { |tm| tm.type == "demandeur" }.email
    demandeur = User.find_by(email: demandeur_email)

    selected_organization = demandeur.organizations.find { |o| o["id"] == organization_id }
    siret = selected_organization["siret"]

    response = ApiSirene.call(siret)

    if response.nil? || response[:etat_administratif] != "A"
      throw :abort
    else
      self.siret = siret
      self.zip_code = response[:code_postal]
      self.nom_raison_sociale = response[:nom_raison_sociale]
    end
  end

  def update_validation
    unless intitule.present?
      errors.add(:intitule, :invalid,
        message: "Vous devez renseigner le nom du projet avant de continuer. Aucun changement n’a été sauvegardé.")
    end
    # the following 2 errors should never occur #defensiveprogramming
    unless target_api.present?
      errors.add(:target_api, :invalid,
        message: "Une erreur inattendue est survenue: pas d’API cible. Aucun changement n’a été sauvegardé.")
    end
    unless organization_id.present?
      errors.add(:organization_id, :invalid,
        message: "Une erreur inattendue est survenue: pas d’organisation. Aucun changement n’a été sauvegardé.")
    end
  end

  def team_members_validation(type, label, validate_full_profile = true)
    email_regex = URI::MailTo::EMAIL_REGEXP
    # loose homemade regexp to match large amount of phone number
    phone_number_regex = /^\+?(?:[0-9][ -]?){6,14}[0-9]$/

    unless team_members.exists?(type: type)
      errors.add(:team_members, :invalid, message: "Vous devez renseigner un contact #{label} avant de continuer")
    end
    team_members.where(type: type).each do |team_member|
      if !email_regex.match?(team_member.email)
        errors.add(:team_members, :invalid,
          message: "Vous devez renseigner un email valide pour le #{label} avant de continuer")
      elsif !Debounce.call(team_member.email)
        errors.add(:team_members, :invalid,
          message: "Vous devez renseigner un email valide pour le #{label} avant de continuer")
      end
      unless phone_number_regex.match?(team_member.phone_number)
        errors.add(:team_members, :invalid,
          message: "Vous devez renseigner un numéro de téléphone valide pour le #{label} avant de continuer")
      end

      next unless validate_full_profile

      unless team_member.job.present?
        errors.add(:team_members, :invalid,
          message: "Vous devez renseigner un intitulé de poste valide pour le #{label} avant de continuer")
      end
      unless team_member.given_name.present?
        errors.add(:team_members, :invalid,
          message: "Vous devez renseigner un nom valide pour le #{label} avant de continuer")
      end
      unless team_member.family_name.present?
        errors.add(:team_members, :invalid,
          message: "Vous devez renseigner un prénom valide pour le #{label} avant de continuer")
      end
    end
  end

  def responsable_technique_validation
    team_members_validation("responsable_technique", "responsable technique")
  end

  def rgpd_validation
    unless data_retention_period.present?
      errors.add(:data_retention_period, :invalid,
        message: "Vous devez renseigner la conservation des données avant de continuer")
    end
    unless data_recipients.present?
      errors.add(:data_recipients, :invalid,
        message: "Vous devez renseigner les destinataires des données avant de continuer")
    end
    team_members_validation("delegue_protection_donnees", EnrollmentsController::DELEGUE_PROTECTION_DONNEES_LABEL)
    team_members_validation("responsable_traitement", EnrollmentsController::RESPONSABLE_TRAITEMENT_LABEL)
  end

  def cadre_juridique_validation
    unless fondement_juridique_title.present?
      errors.add(:fondement_juridique_title, :invalid,
        message: "Vous devez renseigner la nature du texte vous autorisant à traiter les données avant de continuer")
    end
    unless fondement_juridique_url.present? || documents.where(type: "Document::LegalBasis").present?
      errors.add(:fondement_juridique_url, :invalid,
        message: "Vous devez joindre l’URL ou le document du texte relatif au traitement avant de continuer")
    end
  end

  def previous_enrollment_id_validation
    unless previous_enrollment_id.present?
      errors.add(:previous_enrollment_id, :invalid,
        message: "Vous devez associer cette demande d’habilitation à une habilitation Franceconnect validée")
    end
  end

  def technical_team_validation
    unless technical_team_type.present?
      errors.add(:technical_team_type, :invalid,
        message: "Vous devez préciser qui va implémenter l’API avant de continuer")
    end
    if technical_team_type == "software_company" && !technical_team_value.present?
      errors.add(:technical_team_value, :invalid, message: "Vous devez préciser le nom de l’éditeur avant de continuer")
    end
    if technical_team_type == "other" && !technical_team_value.present?
      errors.add(:technical_team_value, :invalid,
        message: "Vous devez préciser qui va implémenter l’API avant de continuer")
    end
  end

  def submit_validation
    rgpd_validation
    cadre_juridique_validation

    unless description.present?
      errors.add(:description, :invalid,
        message: "Vous devez renseigner la description de la démarche avant de continuer")
    end
    unless nom_raison_sociale
      errors.add(:siret, :invalid,
        message: "Vous devez renseigner un SIRET d’organisation valide avant de continuer")
    end
    unless cgu_approved?
      errors.add(:cgu_approved, :invalid,
        message: "Vous devez valider les modalités d’utilisation avant de continuer")
    end
    unless dpo_is_informed?
      errors.add(:dpo_is_informed, :invalid,
        message: "Vous devez confirmer avoir informé le DPD de votre organisation avant de continuer")
    end
  end
end
