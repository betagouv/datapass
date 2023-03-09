# frozen_string_literal: true

class ExtractHubeePortailEnrollmentsToArchive
  attr_reader :enrollment

  def call
    enrollment_ids = duplicated_hubee_portail_enrollments.pluck(:id)
    Enrollment.find(enrollment_ids)
  end

  def duplicated_hubee_portail_enrollments
    validated_hubee_enrollments = Enrollment.where(target_api: "hubee_portail", status: "validated")
    invalidated_hubee_enrollments = Enrollment.where(target_api: "hubee_portail", status: ["draft", "submitted", "changes_requested"])
    invalidated_hubee_enrollments.select do |invalidated_enrollment|
      validated_hubee_enrollments.find { |validated_enrollment| validated_enrollment.organization_id == invalidated_enrollment.organization_id }
    end
  end
end
