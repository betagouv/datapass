class Document::PdfDocument < Document
  mount_uploader :attachment, PdfUploader

  private

  def content_type_validation
    if attachment&.file && !MagicPdfValidator.new(file_content).valid?
      errors.add("attachment", :invalid, message: "Format de fichier invalide. Merci de joindre uniquement des documents au format pdf.")
    end
  rescue RuntimeError
    errors.add("attachment", :invalid, message: "Format de fichier invalide. Merci de joindre uniquement des documents au format pdf.")
  end
end
