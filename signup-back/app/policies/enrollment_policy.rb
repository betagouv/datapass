class EnrollmentPolicy < ApplicationPolicy
  def show?
    user.is_member?(record) || user.is_reporter?(record.target_api)
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
    (record.status_draft? || record.status_changes_requested?) &&
      user.belongs_to_organization?(record) &&
      user.is_demandeur?(record)
  end

  def notify?
    record.can_notify_status? && user.is_instructor?(record.target_api)
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

  def get_email_templates?
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
        :attachment,
        :type
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
      scope.includes(:team_members).where(target_api: target_apis)
        .or(scope.includes(:team_members).where(team_members: {user: user}))
    end
  end
end
