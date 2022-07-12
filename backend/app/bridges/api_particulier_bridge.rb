class ApiParticulierBridge < ApplicationBridge
  def call
    name = "#{@enrollment.nom_raison_sociale} - #{@enrollment.id}"
    responsable_technique_email = @enrollment.team_members.where(type: "responsable_technique").pluck(:email).first
    demandeur_email = @enrollment.demandeurs.pluck(:email).first
    scopes = @enrollment[:scopes].reject { |_, v| !v }.keys
    linked_token_manager_id = create_enrollment_in_token_manager(
      @enrollment.id,
      name,
      responsable_technique_email,
      demandeur_email,
      scopes
    )
    @enrollment.update({linked_token_manager_id: linked_token_manager_id})
  end

  private

  def create_enrollment_in_token_manager(id, name, responsable_technique_email, demandeur_email, scopes)
    response = Http.instance.post({
      url: "#{ENV.fetch("API_PARTICULIER_HOST")}/api/applications",
      body: {
        name: name,
        technical_contact_email: responsable_technique_email,
        author_email: demandeur_email,
        data_pass_id: id,
        scopes: scopes
      },
      auth_header: "X-Api-Key",
      api_key: ENV.fetch("API_PARTICULIER_API_KEY"),
      tag: "API Particulier"
    })

    response.parse["id"]
  end
end
