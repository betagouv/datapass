class Enrollment::ApiTiersDePrestation < Enrollment
  protected

  def submit_validation
    super

    responsable_technique_validation

    unless documents.where(type: "Document::AttestationFiscale").present?
      errors[:documents_attributes] << "Vous devez joindre votre attestation fiscale avant de continuer"
    end
  end
end
