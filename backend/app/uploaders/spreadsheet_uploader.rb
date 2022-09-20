class SpreadsheetUploader < DocumentUploader
  def extension_allowlist
    %w[xls xlsx sxc ods]
  end
end
