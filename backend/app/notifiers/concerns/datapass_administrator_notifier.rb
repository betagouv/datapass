# frozen_string_literal: true

module DatapassAdministratorNotifier
  def notify_administrators_for_unknown_software_enrollment
    EnrollmentMailer.with(
      target_api: :target_api,
      enrollment_id: :id
    ).notification_email_unknown_software.deliver_later
  end
end
