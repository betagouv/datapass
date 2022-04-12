class TeamMember::Comptable < TeamMember
  def has_linked_user
    false
  end
end
