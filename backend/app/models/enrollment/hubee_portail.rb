class Enrollment::HubeePortail < Enrollment
  protected

  def hubee_certdc_status_validated
    demandeur_user_id = demandeurs.first["user_id"]
    user = User.find(demandeur_user_id)

    enrollments = EnrollmentPolicy::OrganizationScope.new(user, Enrollment).resolve
    enrollments
      .where(target_api: %w[hubee_portail])
      .where(siret: siret)
      .where(status: "validated")
  end

  def no_hubee_certdc_validation
    if hubee_certdc_status_validated.present?
      errors.add(:siret, :validated,
        message: "Une habilitation HubEE - Démarche CertDC existe déjà au sein de votre organisation")
    end
  end

  def submit_validation
    errors.add(:siret, :invalid, message: "Vous devez renseigner un SIRET d’organisation valide avant de continuer") unless nom_raison_sociale
    errors.add(:cgu_approved, :invalid, message: "Vous devez valider les modalités d’utilisation avant de continuer") unless cgu_approved?
    errors.add(:dpo_is_informed, :invalid, message: "Vous devez confirmer avoir informé le DPD de votre organisation avant de continuer") unless dpo_is_informed?
    team_members_validation("responsable_metier", "administrateur métier")
    no_hubee_certdc_validation

    if scopes.empty?
      errors.add(:scopes, :invalid, message: "Vous devez cocher au moins une démarche en ligne avant de continuer")
    end
  end
end
