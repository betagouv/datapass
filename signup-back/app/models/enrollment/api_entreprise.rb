class Enrollment::ApiEntreprise < Enrollment
  protected

  def sent_validation
    super

    scopes_validation
    team_members_validation("responsable_technique", "contact technique")
    team_members_validation("contact_metier", "contact métier")
  end
end
