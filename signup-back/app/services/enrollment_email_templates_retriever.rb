class EnrollmentEmailTemplatesRetriever
  attr_reader :enrollment,
    :instructor

  def initialize(enrollment, instructor)
    @enrollment = enrollment
    @instructor = instructor
  end

  def perform
    email_kinds.map do |email_kind|
      build_template(email_kind)
    end
  end

  private

  def build_template(email_kind)
    EnrollmentEmailTemplate.new(
      action_name: email_kind,
      sender_email: target_api_data["support_email"],
      subject: target_api_data["mailer"][email_kind]["subject"],
      user_email: enrollment.demandeurs.pluck(:email).first,
      plain_text_content: render_template(email_kind)
    )
  end

  def render_template(email_kind)
    if custom_template_exists?(email_kind)
      render_specific_template_without_layout(email_kind)
    else
      render_default_template(email_kind)
    end
  end

  def render_specific_template_without_layout(email_kind)
    renderer.render(
      file: "enrollment_mailer/#{enrollment.target_api}/#{email_kind}",
      layout: false
    )
  end

  def render_default_template(email_kind)
    renderer.render(
      file: "enrollment_mailer/#{email_kind}",
      layout: false
    )
  end

  def custom_template_exists?(email_kind)
    File.exist?(
      Rails.root.join(
        "app/views/enrollment_mailer/#{enrollment.target_api}/#{email_kind}.text.erb"
      )
    )
  end

  def renderer
    @renderer ||= ActionView::Base.new("app/views", variables)
  end

  def variables
    @variables ||= {
      url: enrollment_url,
      target_api_label: target_api_label,
      front_host: front_host,
      user: user,
      enrollment: enrollment,
      instructor: instructor
    }
  end

  def enrollment_url
    "#{front_host}/#{enrollment.target_api.tr("_", "-")}/#{enrollment.id}"
  end

  def target_api_label
    target_api_data["label"]
  end

  def front_host
    ENV.fetch("FRONT_HOST")
  end

  def user
    @user ||= enrollment.demandeurs.first
  end

  def email_kinds
    %w[
      notify
      refuse_application
      review_application
      validate_application
    ].freeze
  end

  def target_api_data
    DataProvidersConfiguration.instance.config_for(enrollment.target_api)
  end
end
