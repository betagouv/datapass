# frozen_string_literal: true

class ExtractHubeePortailEnrollmentsToArchive
  attr_reader :enrollment

  def call
    enrollment_ids = duplicated_hubee_portail_enrollments.pluck(:enrollment_id)
    Enrollment.find(enrollment_ids)
  end

  def duplicated_hubee_portail_enrollments
    subquery = Enrollment.joins(:team_members)
      .where(status: "validated", target_api: "hubee_portail", team_members: {type: "demandeur"})
      .pluck("enrollments.id", "team_members.id")

    Enrollment.joins(:team_members)
      .where(target_api: "hubee_portail", status: %w[draft changes_requested submitted])
      .where.not(id: subquery)
      .distinct
  end
end
