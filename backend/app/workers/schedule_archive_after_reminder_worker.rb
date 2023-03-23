# frozen_string_literal: true

require "sidekiq-scheduler"

class ScheduleArchiveAfterReminderWorker < ApplicationWorker
  sidekiq_options queue: "archive"

  def perform
    ArchiveAfterReminderEnrollments.new.call.map(&:archive!)
  end
end
