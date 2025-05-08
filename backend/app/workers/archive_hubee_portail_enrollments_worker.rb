# frozen_string_literal: true

require "sidekiq-scheduler"

class ArchiveHubeePortailEnrollmentsWorker < ApplicationWorker
  sidekiq_options queue: "archive"

  def perform
    ExtractHubeePortailEnrollmentsToArchive.new.call.each do |archivable_enrollment|
      send_email(archivable_enrollment)
      archivable_enrollment.archive!
    end
  end

  def send_email(enrollment)
    HubeePortailMailer.with(
      enrollment_id: enrollment.id
    ).archive_hubee_portail_enrollment_email.deliver_later
  end
end
