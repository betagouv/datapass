# frozen_string_literal: true

require "sidekiq-scheduler"

class ScheduleArchiveEnrollmentsWorker < ApplicationWorker
  sidekiq_options queue: "archive"

  def perform
    ArchiveEnrollments.new.call.each do |enrollment|
      enrollment.update!(status: "archived")
      enrollment.events.create!(name: "archive")
    end
  end
end
