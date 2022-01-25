class TeamMember::Aidant < TeamMember
  def has_linked_user
    false
  end
end
