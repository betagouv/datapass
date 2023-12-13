class EnrollmentsLiveController < AuthenticatedUserController
  def export
    spreadsheet = SpreadsheetGenerator.new(policy_scope(Enrollment)).perform

    send_data spreadsheet, filename: "export-datapass-#{Date.today}.xlsx", type: "application/xlsx"
  end
end
