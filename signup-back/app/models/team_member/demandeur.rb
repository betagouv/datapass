class TeamMember::Demandeur < TeamMember
  def has_linked_user
    true
  end

  protected

  def set_user
    super
    self.family_name = user.family_name
    self.given_name = user.given_name
    self.phone_number = user.phone_number
    self.job = user.job
  end
end
