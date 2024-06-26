class RemoveCnousRolesToSubInstructorApiParticulier < ActiveRecord::Migration[7.0]
  def up
    return unless subinstructor_exists?

    remove_roles(
      [subinstructor_email],
      ["api_particulier:cnous:subscriber", "api_particulier:cnous:reporter"]
    )
  end

  def down
    add_roles(
      [subinstructor_email],
      ["api_particulier:cnous:subscriber", "api_particulier:cnous:reporter"]
    )
  end

  private

  def add_roles(emails, roles_to_add)
    users = User.where(email: emails)
    users.each do |user|
      current_roles = user.roles || []
      user.update(roles: current_roles + roles_to_add)
    end
  end

  def remove_roles(emails, roles_to_remove)
    users = User.where(email: emails)
    users.each do |user|
      current_roles = user.roles || []
      updated_roles = current_roles - roles_to_remove
      user.update(roles: updated_roles)
    end
  end

  def subinstructor_email = Rails.application.credentials.enseignementsup_subinstructor.email

  def subinstructor_exists? = Rails.application.credentials.enseignementsup_subinstructor.present?
end
