class PdfUploader < DocumentUploader
  def extension_whitelist
    ["pdf"]
  end
end
