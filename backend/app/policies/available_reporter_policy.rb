class AvailableReporterPolicy < ApplicationPolicy
  alias_method :target_api, :record

  def index?
    user.is_instructor?(target_api)
  end
end
