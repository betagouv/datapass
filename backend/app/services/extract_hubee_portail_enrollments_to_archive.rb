# frozen_string_literal: true

class ExtractHubeePortailEnrollmentsToArchive
  attr_reader :enrollment

  def call
    duplicated_hubee_portail_enrollments
  end

  def duplicated_hubee_portail_enrollments
    validated_hubee_enrollments = Enrollment.where(target_api: "hubee_portail", status: "validated")
    unnecessary_enrollments = Enrollment.where(target_api: "hubee_portail", status: ["draft", "submitted", "changes_requested"])
    unnecessary_enrollments.select do |unnecessary_enrollment|
      validated_hubee_enrollments.find { |validated_enrollment| validated_enrollment.organization_id == unnecessary_enrollment.organization_id }
    end
  end
end
