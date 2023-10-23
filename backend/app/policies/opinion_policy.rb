class OpinionPolicy < ApplicationPolicy
  def create?
    user.is_instructor?(record.target_api)
  end
end
