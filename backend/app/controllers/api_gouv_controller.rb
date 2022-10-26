class ApiGouvController < ApplicationController
  # GET /api_gouv/apis_list
  def apis_list
    apis_list = ApiGouv.call

    if apis_list.nil?
      return render status: :not_found, json: {apis_list: nil}
    end

    render status: :ok, json: {
      apis_list: apis_list
    }
  end
end
