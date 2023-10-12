class DocumentsController < ApplicationController
  before_action :authenticate_user!

  def show
    @document = Document.find(params[:id])

    authorize @document.attachable, :show? if @document.attachable.is_a?(Enrollment)

    if @document.attachment.present?
      send_file(
        @document.file_content,
        filename: @document.attachment.file.filename
      )
    else
      render json: {}, status: :not_found
    end
  end
end
