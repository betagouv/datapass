class EnrollmentsLiveController < AuthenticatedUserController
  def export
    enrollments = policy_scope(Enrollment).includes(:events, :team_members)

    if enrollments.any?
      send_data SpreadsheetGenerator.new(enrollments).perform, filename: "export-datapass-#{Date.today}.xlsx", type: "application/xlsx"
    else
      head :not_found
    end
  end
end
