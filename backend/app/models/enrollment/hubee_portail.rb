class Enrollment::HubeePortail < Enrollment
  protected

  def submit_validation
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale
    errors[:cgu_approved] << "Vous devez valider les modalités d’utilisation avant de continuer" unless cgu_approved?
    errors[:dpo_is_informed] << "Vous devez confirmer avoir informé le DPD de votre organisation avant de continuer" unless dpo_is_informed?
    team_members_validation("responsable_metier", "responsable d’abonnement")

    unless scopes.any? { |_, v| v }
      errors[:scopes] << "Vous devez cocher au moins une démarche en ligne avant de continuer"
    end
  end
end
