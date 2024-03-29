class Enrollment::ApiDeclarationCesu < Enrollment
  protected

  def submit_validation
    super

    responsable_technique_validation

    unless documents.where(type: "Document::AttestationFiscale").present?
      errors.add(:documents, :invalid, message: "Vous devez joindre votre attestation fiscale avant de continuer")
    end
  end
end
