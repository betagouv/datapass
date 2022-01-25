class DocumentsController < ApplicationController
  before_action :authenticate_user!

  def show
    @document = authorize Document.find(params[:id]), policy_class: DocumentPolicy
    send_file(
      @document.attachment.current_path
    )
  end
end
