class ApplicationController < ActionController::API
  class AccessDenied < StandardError
  end

  class Forbidden < StandardError
  end

  class UnprocessableEntity < StandardError
  end

  class Accepted < StandardError
  end

  class BadGateway < StandardError
    attr_reader :endpoint_label
    attr_reader :url
    attr_reader :http_code
    attr_reader :http_body
    def initialize(endpoint_label, url, http_code, http_body)
      @endpoint_label = endpoint_label
      @url = url
      @http_code = http_code
      @http_body = http_body
    end
  end

  include Pundit

  rescue_from AccessDenied do |e|
    render status: :unauthorized, json: {
      message: "Vous n’êtes pas autorisé à accéder à cette API",
      detail: e.message
    }
  end

  rescue_from Forbidden do |e|
    render status: :forbidden, json: {
      message: e.message
    }
  end

  rescue_from BadGateway do |e|
    render status: :bad_gateway, json: {
      message: "Impossible d’envoyer les données à \"#{e.endpoint_label}\".\n\nMerci de communiquer les détails techniques de l’erreur à contact@api.gouv.fr :\n- url: #{e.url}\n- http code: #{e.http_code}\n- http body: #{e.http_body.to_json}\n- message: #{e.message}"
    }
  end

  rescue_from UnprocessableEntity do |e|
    render status: :unprocessable_entity, json: {
      message: e.message
    }
  end

  rescue_from Accepted do |e|
    render status: :accepted, json: {
      message: e.message
    }
  end

  rescue_from Pundit::NotAuthorizedError do |exception|
    policy = exception.policy
    error_key = policy.respond_to?(:error_message_key) ? policy.error_message_key : nil

    error_message = case error_key
    when :copy_enrollment_is_not_validated_nor_refused
      "Copie impossible, la demande originale n’est ni validée ni refusée."
    when :copy_user_do_not_belong_to_organization
      "Copie impossible, la demande originale est déposée au nom d’une organisation à laquelle vous n’appartenez pas."
    when :copy_user_is_not_demandeur
      "Copie impossible, vous n’êtes pas le demandeur de la demande originale."
    else
      "Vous n’êtes pas autorisé à modifier cette ressource"
    end

    render status: :forbidden, json: {
      message: error_message
    }
  end

  rescue_from ActiveRecord::RecordNotFound do |_|
    render status: :not_found, json: {
      message: "Record not found"
    }
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    error_message = if e.message.to_s.include? "Copied from enrollment"
      "Copie impossible, une copie de cette demande d’habilitation existe déjà."
    else
      e.message.to_s
    end

    render status: :unprocessable_entity, json: {
      message: error_message
    }
  end

  protected

  def clear_user_session!
    return unless user_signed_in?

    session.delete("access_token")
    session.delete("id_token")

    sign_out current_user
  end

  private

  def pagination_dict(collection)
    {
      current_page: collection.current_page,
      next_page: collection.next_page,
      prev_page: collection.prev_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count
    }
  end
end
