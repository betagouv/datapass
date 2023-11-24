class ReopenEnrollment < ApplicationOrganizer
  before do
    context.enrollment_transition = "reopen"
  end

  organize Enrollment::ExecuteTransition
end
