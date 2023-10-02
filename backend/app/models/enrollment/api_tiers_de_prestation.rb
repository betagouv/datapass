class Enrollment::ApiTiersDePrestation < Enrollment
  protected

  def submit_validation
    super

    responsable_technique_validation
    team_members_validation("comptable", "contact comptable")

    unless documents.where(type: "Document::AttestationFiscale").present?
      errors.add(:documents, :invalid, message: "Vous devez joindre votre attestation fiscale avant de continuer")
    end
  end
end
