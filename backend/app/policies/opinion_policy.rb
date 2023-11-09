class OpinionPolicy < ApplicationPolicy
  def index?
    enrollment = record

    user.is_instructor?(enrollment.target_api) ||
      user.is_reporter?(enrollment)
  end

  def show?
    enrollment = record.enrollment

    user.is_instructor?(enrollment.target_api) ||
      user.is_reporter?(enrollment)
  end

  def create?
    user.is_instructor?(record.target_api)
  end

  def comment?
    user == record.reporter
  end
end
