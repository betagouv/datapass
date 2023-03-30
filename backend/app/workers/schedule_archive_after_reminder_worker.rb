# frozen_string_literal: true

require "sidekiq-scheduler"

class ScheduleArchiveAfterReminderWorker < ApplicationWorker
  sidekiq_options queue: "archive"

  def perform
    ExtractEnrollmentsToArchive.new.call.map(&:archive!)
  end
end
