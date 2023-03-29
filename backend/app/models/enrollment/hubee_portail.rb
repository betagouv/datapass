class Enrollment::HubeePortail < Enrollment
  protected

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
