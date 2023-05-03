# frozen_string_literal: true

require "sidekiq-scheduler"

class ScheduleEnrollmentsArchiveableWorker < ApplicationWorker
  sidekiq_options queue: "archive"

  def perform
    EnrollmentsExtractor::ToArchive.new.call.map(&:archive!)
  end
end
