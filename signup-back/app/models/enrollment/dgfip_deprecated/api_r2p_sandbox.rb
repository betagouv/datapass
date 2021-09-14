class Enrollment::ApiR2pSandbox < Enrollment::DgfipDeprecated::SandboxEnrollment
  protected

  def sent_validation
    super

    # Données
    errors[:rgpd_general_agreement] << "Vous devez attester respecter les principes RGPD avant de continuer" unless additional_content&.fetch("rgpd_general_agreement", false)
  end
end
