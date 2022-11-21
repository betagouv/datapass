class FcDataProviderBridge < ApplicationBridge
  def call
    EnrollmentMailer.with(
      target_api: @enrollment.target_api,
      subject: "[DataPass] nouveaux scopes pour \"#{@enrollment.nom_raison_sociale} - #{@enrollment.id}\"",
      template_name: "add_scopes_in_franceconnect",
      nom_raison_sociale: @enrollment.nom_raison_sociale,
      enrollment_id: @enrollment.id,
      previous_enrollment_id: @enrollment.previous_enrollment_id,
      scopes: @enrollment.scopes
    ).notify_support_franceconnect.deliver_later
  end
end
