class Enrollment::ApiDeclarationEmbauche < Enrollment
  protected

  def update_validation
    errors.add(:target_api, :invalid, message: "Une erreur inattendue est survenue: pas d’API cible. Aucun changement n’a été sauvegardé.") unless target_api.present?
    errors.add(:organization_id, :invalid, message: "Une erreur inattendue est survenue: pas d’organisation. Aucun changement n’a été sauvegardé.") unless organization_id.present?
  end

  def submit_validation
    errors.add(:siret, :invalid, message: "Vous devez renseigner un SIRET d’organisation valide avant de continuer") unless nom_raison_sociale
  end
end
