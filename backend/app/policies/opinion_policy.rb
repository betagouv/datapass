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
    enrollment = record

    user.is_instructor?(enrollment.target_api)
  end

  def comment?
    user == record.reporter
  end

  def destroy?
    user.is_instructor?(record.enrollment.target_api)
  end
end
