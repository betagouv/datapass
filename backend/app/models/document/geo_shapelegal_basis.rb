class Document::GeoShape < Document
  mount_uploader :attachment, DocumentUploader

  private

  def content_type_validation
  end
end
