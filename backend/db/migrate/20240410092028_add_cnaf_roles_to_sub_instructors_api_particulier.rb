class AddCnafRolesToSubInstructorsApiParticulier < ActiveRecord::Migration[7.0]
  def up
    add_roles(
      ["georges.bayard@sante.gouv.fr", "nicolas.choquet@cnav.fr", "ludovic.gaud@cnav.fr", "maxime.roumeas@cnav.fr"],
      ["api_particulier:cnaf:reporter", "api_particulier:cnaf:subscriber"]
    )
  end

  def down
    remove_roles(
      ["georges.bayard@sante.gouv.fr", "nicolas.choquet@cnav.fr", "ludovic.gaud@cnav.fr", "maxime.roumeas@cnav.fr"],
      ["api_particulier:cnaf:reporter", "api_particulier:cnaf:subscriber"]
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
end
