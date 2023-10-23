class OpinionMailer < ActionMailer::Base
  def create
    @opinion = params[:opinion]

    mail(
      to: [@opinion.reporter.email],
      from: "notifications@api.gouv.fr",
      subject: t(".subject")
    )
  end
end
