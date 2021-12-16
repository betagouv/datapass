class Enrollment < ActiveRecord::Base
  self.inheritance_column = "target_api"

  # enable Single Table Inheritance with target_api as discriminatory field
  class << self
    # ex: 'api_particulier' => Enrollment::ApiParticulier
    def find_sti_class(target_api)
      "Enrollment::#{target_api.underscore.classify}".constantize
    end

    # ex: Enrollment::ApiParticulier => 'api_particulier'
    def sti_name
      name.demodulize.underscore
    end
  end

  validate :update_validation
  validate :submit_validation, on: :submit

  before_save :clean_and_format_scopes
  before_save :set_company_info, if: :will_save_change_to_organization_id?

  has_many :documents, as: :attachable
  accepts_nested_attributes_for :documents
  has_many :events, dependent: :destroy
  belongs_to :copied_from_enrollment, class_name: :Enrollment, foreign_key: :copied_from_enrollment_id, optional: true
  validates :copied_from_enrollment, uniqueness: true, if: -> { copied_from_enrollment.present? }
  belongs_to :previous_enrollment, class_name: :Enrollment, foreign_key: :previous_enrollment_id, optional: true

  has_many :team_members, dependent: :destroy
  accepts_nested_attributes_for :team_members
  has_many :users, through: :team_members

  state_machine :status, initial: :draft, namespace: "status" do
    state :draft
    state :submitted
    state :changes_requested
    state :validated
    state :refused

    event :notify do
      transition changes_requested: same
    end

    event :submit do
      transition from: [:draft, :changes_requested], to: :submitted
    end

    event :refuse do
      transition from: [:changes_requested, :submitted], to: :refused
    end

    event :request_changes do
      transition from: :submitted, to: :changes_requested
    end

    event :validate do
      transition from: :submitted, to: :validated
    end

    before_transition do |enrollment, transition|
      enrollment.valid?(transition.event.to_sym)
    end

    before_transition do |enrollment, transition|
      enrollment.events.create!(
        name: transition.event.to_s,
        user_id: transition.args[0][:user_id],
        comment: transition.args[0][:comment]
      )
    end

    before_transition from: :submitted, to: :validated do |enrollment|
      bridge_enable = !ENV["DISABLE_#{enrollment.target_api.upcase}_BRIDGE"].present?

      if bridge_enable && enrollment.bridge
        enrollment.bridge.call(
          enrollment
        )
      end
    end
  end

  def notify_event(event, *args)
    notifier_class.new(self).public_send(event, *args)
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

  def subscribers
    unless DataProvidersConfiguration.instance.exists?(target_api)
      raise ApplicationController::UnprocessableEntity, "Une erreur inattendue est survenue: API cible invalide."
    end
    # Pure string conditions in a where query is dangerous!
    # see https://guides.rubyonrails.org/active_record_querying.html#pure-string-conditions
    # As long as the injected parameters is verified against a whitelist, we consider this safe.
    User.where("'#{target_api}:subscriber' = ANY(roles)")
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
    events.where(name: "validate").order("created_at").last["created_at"]
  end

  def copy(current_user)
    copied_enrollment = dup
    copied_enrollment.status = :draft
    copied_enrollment.linked_token_manager_id = nil
    copied_enrollment.copied_from_enrollment = self
    team_members.each do |team_member|
      copied_team_member = team_member.dup
      copied_enrollment.team_members << copied_team_member
    end
    copied_enrollment.save!
    copied_enrollment.events.create(
      name: "copy",
      user_id: current_user.id,
      comment: "Demande d’origine : ##{id}"
    )
    documents.each do |document|
      copied_document = document.dup
      copied_document.attachment = File.open(document.attachment.file.file)
      copied_enrollment.documents << copied_document
    end

    copied_enrollment
  end

  protected

  def clean_and_format_scopes
    # we need to convert boolean values as it is send as string because of the data-form serialisation
    self.scopes = scopes.transform_values { |value| value.to_s == "true" }

    # in a similar way, format additional boolean content
    self.additional_content = additional_content.transform_values do |value|
      case value.to_s
      when "true"
        true
      when "false"
        false
      else
        value
      end
    end
  end

  def set_company_info
    # taking the siret from users organization ensure the user belongs to the organization
    current_user_email = team_members.find { |tm| tm.type == "demandeur" }.email
    current_user = User.find_by(email: current_user_email)

    selected_organization = current_user.organizations.find { |o| o["id"] == organization_id }
    siret = selected_organization["siret"]

    response = HTTP.get("https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/#{siret}")

    if response.status.success? && response.parse["etablissement"]["etat_administratif"] == "A"
      nom_raison_sociale = response.parse["etablissement"]["unite_legale"]["denomination"]
      nom_raison_sociale ||= response.parse["etablissement"]["denomination_usuelle"]
      nom = response.parse["etablissement"]["unite_legale"]["nom"]
      prenom_1 = response.parse["etablissement"]["unite_legale"]["prenom_1"]
      prenom_2 = response.parse["etablissement"]["unite_legale"]["prenom_2"]
      prenom_3 = response.parse["etablissement"]["unite_legale"]["prenom_3"]
      prenom_4 = response.parse["etablissement"]["unite_legale"]["prenom_4"]
      nom_raison_sociale ||= "#{nom + "*" unless nom.nil?}#{prenom_1 unless prenom_1.nil?}#{" " + prenom_2 unless prenom_2.nil?}#{" " + prenom_3 unless prenom_3.nil?}#{" " + prenom_4 unless prenom_4.nil?}"
      self.siret = siret
      self.nom_raison_sociale = nom_raison_sociale
    else
      self.organization_id = nil
      self.siret = nil
      self.nom_raison_sociale = nil
    end
  end

  def update_validation
    errors[:intitule] << "Vous devez renseigner l’intitulé de la démarche avant de continuer. Aucun changement n’a été sauvegardé." unless intitule.present?
    # the following 2 errors should never occur #defensiveprogramming
    errors[:target_api] << "Une erreur inattendue est survenue: pas d’API cible. Aucun changement n’a été sauvegardé." unless target_api.present?
    errors[:organization_id] << "Une erreur inattendue est survenue: pas d’organisation. Aucun changement n’a été sauvegardé." unless organization_id.present?
  end

  def team_members_validation(type, label, validate_full_profile = false)
    email_regex = URI::MailTo::EMAIL_REGEXP
    # loose homemade regexp to match large amount of phone number
    phone_number_regex = /^\+?(?:[0-9][ -]?){6,14}[0-9]$/

    unless team_members.exists?(type: type)
      errors[:team_members] << "Vous devez renseigner un contact #{label} avant de continuer"
    end
    team_members.where(type: type).each do |team_member|
      errors[:team_members] << "Vous devez renseigner un email valide pour le #{label} avant de continuer" unless email_regex.match?(team_member.email)
      errors[:team_members] << "Vous devez renseigner un numéro de téléphone valide pour le #{label} avant de continuer" unless phone_number_regex.match?(team_member.phone_number)

      if validate_full_profile
        errors[:team_members] << "Vous devez renseigner un intitulé de poste valide pour le #{label} avant de continuer" unless team_member.job.present?
        errors[:team_members] << "Vous devez renseigner un nom valide pour le #{label} avant de continuer" unless team_member.given_name.present?
        errors[:team_members] << "Vous devez renseigner un prénom valide pour le #{label} avant de continuer" unless team_member.family_name.present?
      end
    end
  end

  def responsable_technique_validation
    team_members_validation("responsable_technique", "responsable technique")
  end

  def rgpd_validation
    errors[:data_retention_period] << "Vous devez renseigner la conservation des données avant de continuer" unless data_retention_period.present?
    errors[:data_recipients] << "Vous devez renseigner les destinataires des données avant de continuer" unless data_recipients.present?
    team_members_validation("delegue_protection_donnees", EnrollmentsController::DELEGUE_PROTECTION_DONNEES_LABEL)
    team_members_validation("responsable_traitement", EnrollmentsController::RESPONSABLE_TRAITEMENT_LABEL)
  end

  def cadre_juridique_validation
    errors[:fondement_juridique_title] << "Vous devez renseigner la nature du texte vous autorisant à traiter les données avant de continuer" unless fondement_juridique_title.present?
    errors[:fondement_juridique_url] << "Vous devez joindre l’URL ou le document du texte relatif au traitement avant de continuer" unless fondement_juridique_url.present? || documents.where(type: "Document::LegalBasis").present?
  end

  def scopes_validation
    errors[:scopes] << "Vous devez cocher au moins un périmètre de données avant de continuer" unless scopes.any? { |_, v| v }
  end

  def previous_enrollment_id_validation
    errors[:previous_enrollment_id] << "Vous devez associer cette demande à une demande Franceconnect validée" unless previous_enrollment_id.present?
  end

  def technical_team_validation
    unless technical_team_type.present?
      errors[:technical_team_type] << "Vous devez préciser qui va implémenter l’API avant de continuer"
    end
    if technical_team_type == "software_company" && !technical_team_value.present?
      errors[:technical_team_value] << "Vous devez préciser le nom de l’éditeur avant de continuer"
    end
    if technical_team_type == "other" && !technical_team_value.present?
      errors[:technical_team_value] << "Vous devez préciser qui va implémenter l’API avant de continuer"
    end
  end

  def submit_validation
    rgpd_validation
    cadre_juridique_validation

    errors[:description] << "Vous devez renseigner la description de la démarche avant de continuer" unless description.present?
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale
    errors[:cgu_approved] << "Vous devez valider les modalités d’utilisation avant de continuer" unless cgu_approved?
    # TODO validate this plus full profile by default
    # errors[:dpo_is_informed] << "Vous devez confirmer avoir informé le DPD de votre organisation avant de continuer" unless dpo_is_informed?
  end
end
