class UserPolicy < ApplicationPolicy
  def update?
    user.is_administrator?
  end

  def create?
    user.is_administrator?
  end

  def permitted_attributes_for_create
    [:email]
  end

  def permitted_attributes
    [
      roles: []
    ]
  end

  class Scope < Scope
    def resolve
      if user.is_administrator?
        scope.all
      else
        raise Pundit::NotAuthorizedError
      end
    end
  end
end
