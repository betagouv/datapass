class ApiDroitsCnamBridge < ApplicationBridge
  def call
    EnrollmentMailer.with(
      target_api: "api_droits_cnam",
      subject: "[DataPass] nouveaux scopes pour \"#{@enrollment.nom_raison_sociale} - #{@enrollment.id}\"",
      template_name: "add_scopes_in_franceconnect",
      nom_raison_sociale: @enrollment.nom_raison_sociale,
      enrollment_id: @enrollment.id,
      previous_enrollment_id: @enrollment.previous_enrollment_id,
      scopes: @enrollment[:scopes].reject { |k, v| !v }.keys
    ).notify_support_franceconnect.deliver_later
  end
end
