class TeamMember::DemandeurPolicy < TeamMemberPolicy
  def permitted_attributes
    [:email]
  end
end
