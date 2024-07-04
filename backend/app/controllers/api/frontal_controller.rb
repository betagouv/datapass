class Api::FrontalController < ApiController
  def index
    if frontal?
      render json: {
        frontal: true
      }, status: :ok
    else
      render json: {
        frontal: false
      }, status: 418
    end
  end

  private

  def frontal?
    ENV["FRONTAL"] == "true"
  end
end
