class TeamMember::AidantPolicy < TeamMemberPolicy
  def permitted_attributes
    [
      :family_name,
      :given_name,
      :email,
      :job
    ]
  end
end
