class Document::OutdatedDocument < Document
  mount_uploader :attachment, PdfUploader

  private

  def content_type_validation
    raise "This document type is deprecated"
  end
end
