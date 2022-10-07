class PdfUploader < DocumentUploader
  def extension_allowlist
    %w[pdf]
  end
end
