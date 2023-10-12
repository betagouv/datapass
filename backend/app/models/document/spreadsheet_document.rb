class Document::SpreadsheetDocument < Document
  mount_uploader :attachment, SpreadsheetUploader

  private

  def content_type_validation
    if attachment&.file && !MagicSpreadsheetValidator.new(file_content).valid?
      errors.add("attachment", :invalid, message: "Format de fichier invalide. Merci de joindre uniquement des documents au format xlsx, xls, ods ou sxc.")
    end
  rescue RuntimeError
    errors.add("attachment", :invalid, message: "Format de fichier invalide. Merci de joindre uniquement des documents au format xlsx, xls, ods ou sxc.")
  end
end
