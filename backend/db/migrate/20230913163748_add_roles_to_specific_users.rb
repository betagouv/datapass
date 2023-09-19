class AddRolesToSpecificUsers < ActiveRecord::Migration[7.0]
  def up
    add_roles(
      ["georges.bayard@sante.gouv.fr", "nicolas.choquet@cnav.fr", "frederic.thery-merland@cnav.fr", "maxime.roumeas@cnav.fr"],
      ["api_particulier:css:reporter", "api_particulier:css:subscriber"]
    )

    add_roles(
      ["diamondra.tsiazonaly@education.gouv.fr", "api-sco-eleve_contacts@education.gouv.fr"],
      ["api_particulier:men:reporter", "api_particulier:men:subscriber"]
    )

    add_roles(["vincent.mazalaigue@modernisation.gouv.fr"], ["administrator"])
  end

  def down
    remove_roles(
      ["georges.bayard@sante.gouv.fr", "nicolas.choquet@cnav.fr", "frederic.thery-merland@cnav.fr", "maxime.roumeas@cnav.fr"],
      ["api_particulier:css:reporter", "api_particulier:css:subscriber"]
    )

    remove_roles(
      ["diamondra.tsiazonaly@education.gouv.fr", "api-sco-eleve_contacts@education.gouv.fr"],
      ["api_particulier:men:reporter", "api_particulier:men:subscriber"]
    )

    remove_roles(["vincent.mazalaigue@modernisation.gouv.fr"], ["administrator"])
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
