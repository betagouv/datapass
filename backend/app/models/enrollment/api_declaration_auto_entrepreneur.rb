class Enrollment::ApiDeclarationAutoEntrepreneur < Enrollment
  protected

  def submit_validation
    rgpd_validation
    cadre_juridique_validation

    errors.add(:description, :invalid, "Vous devez renseigner la description de la démarche avant de continuer") unless description.present?
    errors.add(:siret, :invalid, "Vous devez renseigner un SIRET d’organisation valide avant de continuer") unless nom_raison_sociale

    responsable_technique_validation

    unless documents.where(type: "Document::AttestationFiscale").present?
      errors.add(:documents_attributes, :invalid, "Vous devez joindre l’attestation fiscale avant de continuer")
    end
  end
end
