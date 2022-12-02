class EnrollmentsExportController < ApplicationController
  include ActionController::Live

  before_action :authenticate_user!

  # GET /enrollments/export
  def export
    @enrollments = policy_scope(Enrollment)

    response.headers["X-Accel-Buffering"] = "no"
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Content-Type"] = "text/csv; charset=utf-8"
    response.headers["Content-Disposition"] =
      %(attachment; filename="export-datapass-#{Date.today}.csv")
    response.headers["Last-Modified"] = Time.zone.now.ctime.to_s
    response.stream.write CSV.generate_line(Enrollment.csv_attributes)
    @enrollments.csv_collection.each do |line|
      response.stream.write CSV.generate_line(line)
    end
  ensure
    response.stream.close
  end
end
