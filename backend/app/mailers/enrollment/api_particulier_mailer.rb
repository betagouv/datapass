class Enrollment::ApiParticulierMailer < ActionMailer::Base
  def validate_for_responsable_technique
    @enrollment = Enrollment.find(params[:enrollment_id])
    @responsable_technique = @enrollment.team_members.where(type: "responsable_technique").first
    @enrollment_show_url = "#{ENV.fetch("FRONT_HOST")}/#{@enrollment.target_api.tr("_", "-")}/#{params[:enrollment_id]}"

    mail(
      to: [@responsable_technique.email],
      from: "notifications@api.gouv.fr",
      subject: "Une demande d'accès à l'API Particulier a été validée"
    )
  end
end
