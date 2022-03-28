class Enrollment::ApiTiersDePrestation < Enrollment
  protected

  def submit_validation
    super

    responsable_technique_validation

    unless documents.where(type: "Document::AttestationFiscale").present?
      errors.add(:documents_attributes, :invalid, message: "Vous devez joindre votre attestation fiscale avant de continuer")
    end
  end
end
