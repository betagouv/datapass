class EnrollmentsLiveController < ApplicationController
  before_action :authenticate_user!

  # GET /enrollments/export
  def export
    @enrollments = policy_scope(Enrollment)

    send_data @enrollments.to_csv,
      filename: "export-datapass-#{Date.today}.csv"
  end
end
