class DocumentPolicy < ApplicationPolicy
  def show?
    # must be the same policy than enrollment_policy#show?
    user.is_member?(record.attachable) ||
      user.is_reporter?(record.attachable)
  end
end
