class ApplicationController < ActionController::API
  class Unauthorized < StandardError
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

  before_action :set_paper_trail_whodunnit

  include Pundit::Authorization

  rescue_from Unauthorized do |_|
    render status: :unauthorized, json: {
      message: I18n.t("devise.failure.unauthenticated")
    }
  end

  rescue_from Forbidden do |e|
    render status: :forbidden, json: {
      message: e.message
    }
  end

  rescue_from BadGateway do |e|
    Sentry.set_extras(
      {
        endpoint_label: e.endpoint_label,
        url: e.url,
        http_code: e.http_code,
        http_body: e.http_body.to_json,
        message: e.message
      }
    )
    Sentry.capture_message("Fail to call target's api bridge endpoint #{e.endpoint_label}")

    render status: :bad_gateway, json: {
      message: "Impossible d’envoyer les données à \"#{e.endpoint_label}\".\n\nMerci de communiquer les détails techniques de l’erreur à datapass@api.gouv.fr :\n- url: #{e.url}\n- http code: #{e.http_code}\n- http body: #{e.http_body.to_json}\n- message: #{e.message}"
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

  def build_error(title:, message:)
    {
      "title" => title,
      "message" => message
    }
  end

  rescue_from Pundit::NotAuthorizedError do |exception|
    policy = exception.policy
    error_key = policy.respond_to?(:error_message_key) ? policy.error_message_key : nil

    error = case error_key
    when :copy_enrollment_is_not_validated_nor_refused
      build_error(title: "L'habilitation initiale est encore en traitement", message: "L'action que vous essayez de faire ne sera possible que lorsque l'habilitation sera validée ou refusée. Cette habilitation n'a donc pas été copiée.")
    when :copy_user_do_not_belong_to_organization
      build_error(title: "Vous ne faites pas partie de l'organisation de l'habilitation initiale", message: "L'habilitation que vous essayez de copier a été accordée à une organisation dont vous ne faites pas partie. Si l'organisation initiale n'existe plus, la copie de la demande initiale n'est pas possible : merci de soumettre une nouvelle demande.")
    when :copy_user_is_not_demandeur
      build_error(title: "Vous n'êtes pas le demandeur de l'habilitation initiale", message: "Seul le demandeur de l'habilitation peut en réaliser la copie. Si le demandeur original n'est plus disponible, merci de contacter datapass@api.gouv.fr en expliquant votre situation.")
    when :copy_enrollment_has_already_been_copied
      build_error(title: "Cette demande a déjà été copiée", message: "L'action que vous essayez de faire est impossible, car une copie de l'habilitation existe déjà. Pour continuer, veuillez utiliser cette copie.")
    else
      build_error(title: "Erreur", message: "Vous n’êtes pas autorisé à modifier cette ressource.")
    end

    render status: :forbidden, json: error
  end

  rescue_from ActiveRecord::ActiveRecordError do |e|
    if e.is_a?(ActiveRecord::RecordInvalid)
      if e.message.to_s.include? "Copied from enrollment"
        render status: :unprocessable_entity, json: {
          message: "Copie impossible, une copie de cette habilitation existe déjà."
        }
      else
        render status: :unprocessable_entity, json: e.record.errors
      end
    elsif e.is_a?(ActiveRecord::RecordNotFound)
      render status: :not_found, json: {
        message: "Enregistrement introuvable."
      }
    elsif e.is_a?(ActiveRecord::RecordNotSaved)
      render status: :unprocessable_entity, json: {
        message: "Sauvegarde impossible."
      }
    else
      throw e
    end
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
