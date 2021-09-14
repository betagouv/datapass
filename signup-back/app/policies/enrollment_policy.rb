class EnrollmentPolicy < ApplicationPolicy
  def show?
    user.is_member?(record) || user.is_reporter?(record.target_api)
  end

  def create?
    # note that we cannot use 'user.is_demandeur?(record)' here because team_members
    # are not persisted yet. We cannot use 'where' on team_members and we cannot
    # use team_member.user_id for comparaison since it has not been set yet.
    record.pending? &&
      user.belongs_to_organization?(record) &&
      record.team_members.any? { |t_m| t_m["type"] == "demandeur" && t_m.email == user.email }
  end

  def update?
    (record.pending? || record.modification_pending?) &&
      user.belongs_to_organization?(record) &&
      user.is_demandeur?(record)
  end

  def destroy?
    (record.pending? || record.modification_pending?) &&
      user.is_demandeur?(record)
  end

  def notify?
    record.can_notify? && user.is_instructor?(record.target_api)
  end

  def copy?
    (record.validated? || record.refused?) &&
      user.belongs_to_organization?(record) &&
      user.is_demandeur?(record)
  end

  def send_application?
    record.can_send_application? &&
      user.belongs_to_organization?(record) &&
      user.is_demandeur?(record)
  end

  def validate_application?
    record.can_validate_application? && user.is_instructor?(record.target_api)
  end

  def review_application?
    record.can_review_application? && user.is_instructor?(record.target_api)
  end

  def refuse_application?
    record.can_refuse_application? && user.is_instructor?(record.target_api)
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
