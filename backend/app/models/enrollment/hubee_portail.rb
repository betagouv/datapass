class Enrollment::HubeePortail < Enrollment
  protected

  def submit_validation
    errors.add(:siret, :invalid, "Vous devez renseigner un SIRET d’organisation valide avant de continuer") unless nom_raison_sociale
    errors.add(:cgu_approved, :invalid, "Vous devez valider les modalités d’utilisation avant de continuer") unless cgu_approved?
    errors.add(:dpo_is_informed, :invalid, "Vous devez confirmer avoir informé le DPD de votre organisation avant de continuer") unless dpo_is_informed?
    team_members_validation("responsable_metier", "responsable d’abonnement")

    unless scopes.any? { |_, v| v }
      errors.add(:scopes, :invalid, "Vous devez cocher au moins une démarche en ligne avant de continuer")
    end
  end
end
