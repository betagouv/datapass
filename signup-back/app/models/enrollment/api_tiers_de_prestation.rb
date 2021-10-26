class Enrollment::ApiTiersDePrestation < Enrollment
  protected

  def sent_validation
    super

    responsable_technique_validation

    unless documents.where(type: "Document::AttestationFiscale").present?
      errors[:documents_attributes] << "Vous devez joindre votre attestation fiscale avant de continuer"
    end
    unless documents.where(type: "Document::HabilitationServiceDomicile").present?
      errors[:documents_attributes] << "Vous devez joindre votre habilitation service à domicile avant de continuer"
    end
  end
end
