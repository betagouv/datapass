class ApiParticulierNotifier < BaseNotifier
  include WebhookNotifierMethods

  def validate(comment:, current_user:)
    super

    if responsable_technique.present? && responsable_technique.email != demandeur.email
      Enrollment::ApiParticulierMailer.with(
        enrollment_id: enrollment.id
      ).validate_for_responsable_technique.deliver_later
    end

    deliver_event_webhook(__method__)
  end

  private

  def responsable_technique
    enrollment.team_members.where(type: "responsable_technique").first
  end

  def demandeur
    enrollment.demandeurs.first
  end
end
