class EnrollmentPolicy < ApplicationPolicy
  def show?
    user.is_member?(record) || user.is_reporter?(record)
  end

  def create?
    # note that we cannot use 'user.is_demandeur?(record)' here because team_members
    # are not persisted yet. We cannot use 'where' on team_members and we cannot
    # use team_member.user_id for comparaison since it has not been set yet.
    record.status_draft? &&
      user.belongs_to_organization?(record) &&
      record.team_members.any? { |t_m| t_m["type"] == "demandeur" && t_m.email == user.email }
  end

  def update?
    (record.status_draft? || record.status_changes_requested?) &&
      user.belongs_to_organization?(record) &&
      user.is_demandeur?(record)
  end

  def destroy?
    (
      (record.status_draft? || record.status_changes_requested?) &&
      user.belongs_to_organization?(record) &&
      user.is_demandeur?(record)
    ) || user.is_administrator?
  end

  def notify?
    record.can_notify_status? &&
      (user.is_instructor?(record.target_api) ||
      user.is_demandeur?(record))
  end

  def copy?
    unless record.status_validated? || record.status_refused?
      @error_message_key = :copy_enrollment_is_not_validated_nor_refused
      return false
    end

    unless user.is_demandeur?(record)
      @error_message_key = :copy_user_is_not_demandeur
      return false
    end

    unless user.belongs_to_organization?(record)
      @error_message_key = :copy_user_do_not_belong_to_organization
      return false
    end

    true
  end

  def submit?
    record.can_submit_status? &&
      user.belongs_to_organization?(record) &&
      user.is_demandeur?(record)
  end

  def validate?
    record.can_validate_status? && user.is_instructor?(record.target_api)
  end

  def request_changes?
    record.can_request_changes_status? && user.is_instructor?(record.target_api)
  end

  def refuse?
    record.can_refuse_status? && user.is_instructor?(record.target_api)
  end

  def revoke?
    record.can_revoke_status? && user.is_administrator?
  end

  def get_email_templates?
    user.is_instructor?(record.target_api)
  end

  def mark_demandeur_notify_events_as_processed?
    user.is_instructor?(record.target_api)
  end

  def permitted_attributes
    res = []

    res.concat([
      :cgu_approved,
      :dpo_is_informed,
      :target_api,
      :previous_enrollment_id,
      :organization_id,
      :intitule,
      :description,
      :type_projet,
      :date_mise_en_production,
      :volumetrie_approximative,
      :fondement_juridique_title,
      :fondement_juridique_url,
      :data_recipients,
      :data_retention_period,
      :data_retention_comment,
      :demarche,
      :technical_team_type,
      :technical_team_value,
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job],
      documents_attributes: [
        :id,
        :attachment,
        :type,
        :_destroy
      ]
    ])

    res
  end

  class Scope < Scope
    def resolve
      target_apis = user.roles
        .select { |r| r.end_with?(":reporter") }
        .map { |r| r.split(":").first }
        .uniq

      scope_with_team_members = scope.includes(:team_members)

      # team_members can see enrollments linked to them
      scope = scope_with_team_members.where(team_members: {user: user})

      # instructor can see enrollments according to their rights
      target_apis.each do |target_api|
        sub_scope = scope_with_team_members.where(target_api: target_api)

        # instructor can have a reporter role with access to all groups
        # ex: roles: ["api_particulier:reporter"]
        has_all_groups_role = user.roles.any? { |r| r == "#{target_api}:reporter" }
        unless has_all_groups_role
          # instructor can only have access to only groups for this target_api
          # ex: roles: ["api_particulier:cnaf:reporter", "api_particulier:pole_emploi:reporter"]

          # get the groups
          # ex: ["cnaf", "pole_emploi"]
          groups = user.roles
            .select { |r| r.match(/^#{target_api}:.+:reporter$/) }
            .map { |r| r.split(":").second }
            .uniq
          configuration = DataProviderConfigurations.instance.config_for(target_api)

          # get the corresponding scopes
          # ex: ["cnaf_quotient_familial", "cnaf_allocataires", ...]
          scopes = configuration["groups"]
            .collect { |k, v| groups.include?(k) ? v["scopes"] : [] }
            .flatten

          # we use the postgres "array overlap" operator so the request keep being fast
          # (this operator is available in the postgres "intarray" module)
          sub_scope = sub_scope.where("scopes && ARRAY[?]::text[]", scopes)
        end

        scope = scope.or(sub_scope)
      end

      scope
    end
  end

  class OrganizationScope < Scope
    def resolve
      siret_scope = user.organizations.map { |o| o["siret"] }
      scope.where(siret: siret_scope)
    end
  end
end
