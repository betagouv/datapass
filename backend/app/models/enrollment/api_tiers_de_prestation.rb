require "rubygems"
require "iban-tools"

class Enrollment::ApiTiersDePrestation < Enrollment
  protected

  def submit_validation
    super

    responsable_technique_validation

    unless documents.where(type: "Document::AttestationFiscale").present?
      errors[:documents_attributes] << "Vous devez joindre votre attestation fiscale avant de continuer"
    end

    unless IBANTools::IBAN.valid?(additional_content&.fetch("iban", ""))
      errors[:iban] << "Vous devez renseigner un IBAN valide avant de continuer"
    end
  end
end
