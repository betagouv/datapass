class PdfUploader < DocumentUploader
  def extension_allowlist
    ["pdf"]
  end
end
