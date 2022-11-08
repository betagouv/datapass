class ApiGouvController < ApplicationController
  # GET /api_gouv/apis
  def apis
    apis = ApiGouv.call

    render status: :ok, json:
      apis
  end
end
