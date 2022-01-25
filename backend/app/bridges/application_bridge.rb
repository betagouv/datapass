class ApplicationBridge < ApplicationService
  def initialize(enrollment)
    @enrollment = enrollment
  end

  def call
    raise ::NotImplementedError
  end
end
