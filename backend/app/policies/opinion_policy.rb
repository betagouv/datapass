class OpinionPolicy < ApplicationPolicy
  def show?
    comment?
  end

  def create?
    user.is_instructor?(record.target_api)
  end

  def comment?
    enrollment = record.enrollment

    user.is_instructor?(enrollment.target_api) ||
      user.is_reporter?(enrollment)
  end
end
