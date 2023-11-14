class OpinionMailer < ActionMailer::Base
  def create
    @opinion = params[:opinion]

    mail(
      to: [@opinion.reporter.email],
      from: "notifications@api.gouv.fr",
      subject: t(".subject")
    )
  end

  def comment
    @opinion_comment = params[:opinion_comment]
    @opinion = @opinion_comment.opinion

    mail(
      to: [@opinion.instructor.email],
      from: "notifications@api.gouv.fr",
      subject: t(".subject", enrollment_intitule: @opinion.enrollment.intitule)
    )
  end
end
