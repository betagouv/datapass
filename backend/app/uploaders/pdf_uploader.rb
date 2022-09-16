class PdfUploader < DocumentUploader
  def extension_allowlist
    %w[pdf docx xlsx ods]
  end
end
