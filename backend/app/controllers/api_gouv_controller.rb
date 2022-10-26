class ApiGouvController < ApplicationController
  # GET /api_gouv/apis_list
  def apis_list
    apis_list = ApiGouv.call

    render status: :ok, json:
      apis_list
  end
end
