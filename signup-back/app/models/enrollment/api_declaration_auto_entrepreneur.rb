class Enrollment::ApiDeclarationAutoEntrepreneur < Enrollment
  protected

  def sent_validation
    errors[:description] << "Vous devez renseigner la description de la démarche avant de continuer" unless description.present?
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale

    responsable_technique_validation
    contact_metier_validation

    rgpd_validation

    unless documents.where(type: "Document::AttestationFiscale").present?
      errors[:documents_attributes] << "Vous devez joindre l’attestation fiscale avant de continuer"
    end
  end
end
