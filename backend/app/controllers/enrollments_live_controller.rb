class EnrollmentsLiveController < ApplicationController
  include ActionController::Live

  before_action :authenticate_user!

  # GET /enrollments/export
  def export
    @enrollments = policy_scope(Enrollment)

    # headers inspired from: https://piotrmurach.com/articles/streaming-large-zip-files-in-rails/
    response.headers["Content-Disposition"] =
      %(attachment; filename="export-datapass-#{Date.today}.csv")
    response.headers["Content-Type"] = "text/csv; charset=utf-8"
    response.headers.delete("Content-Length")
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Last-Modified"] = Time.now.httpdate.to_s
    response.headers["X-Accel-Buffering"] = "no"
    response.stream.write CSV.generate_line(Enrollment.csv_attributes)
    @enrollments.csv_collection.each do |line|
      response.stream.write CSV.generate_line(line)
    end
  ensure
    response.stream.close
  end
end
