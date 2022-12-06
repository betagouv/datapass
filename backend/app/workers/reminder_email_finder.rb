# frozen_string_literal: true

class ReminderEmailFinder
  # include EnrollmentReminderMailer

  attr_reader :enrollment, :user

  def initialize(enrollments)
    @enrollments = Enrollment.all
    @user = user
  end

  def call(enrollments)
    algo
  end

  def algo
    if created_at_updated_at_last_events?
      created_at_updated_at_last_events_ids = draft_enrollment_last_events_updated_at_or_created_at(@enrollments).pluck(:enrollment_id).flatten
      enrollments = Enrollment.find(created_at_updated_at_last_events_ids)

      enrollments.each do |enrollment|
        # send_reminder_email(enrollment)
        create_reminder_event(enrollment)
      end
    end
  end

  def draft_enrollments(enrollments)
    Enrollment.where(status: "draft")
      .where({updated_at: (Time.now.beginning_of_day - 1.months)..Time.now.end_of_day - 15.days})
      .includes(:events)
      .where.not({events: {name: %w[notify]}})
      .order(:id, "events.created_at")
  end

  def draft_enrollment_last_events_updated_at_or_created_at(enrollments)
    enrollments = draft_enrollments(enrollments)
    events = enrollments.map { |enrollment| enrollment.events.last }.to_a
    events.reject { |event| event.name == "reminder" }
  end

  def send_reminder_email(enrollment)
    EnrollmentReminderMailer.with(
      target_api: enrollment.target_api,
      enrollment_id: enrollment.id
    ).reminder_draft_enrollment_email.deliver_later
  end

  def create_reminder_event(enrollment)
    enrollment.events.create!(name: "reminder")
  end

  def created_at_updated_at_last_events?
    draft_enrollment_last_events_updated_at_or_created_at(@enrollments).any?
  end
end
