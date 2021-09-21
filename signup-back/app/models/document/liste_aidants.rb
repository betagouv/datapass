class Document::ListeAidants < Document
  # not used in aidants-connect form anymore but we keep this for the documents to be accessible still
  mount_uploader :attachment, DocumentUploader

  private

  def content_type_validation
  end
end
