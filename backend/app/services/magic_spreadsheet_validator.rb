class MagicSpreadsheetValidator < MagicValidator
  # from : https://www.garykessler.net/library/file_sigs.html
  # from https://en.wikipedia.org/wiki/List_of_file_signatures

  # xls: d0 cf 11 e0 [Microsoft Office 97-2003 applications]
  # xlsx: 50 4b 03 04
  # sxc: 50 4b 03 04
  # ODS: 50 4b 03 04

  def valid_trailing_signatures
    "00000000"
  end

  def valid_starting_signature
    %w[504b0304 d0cf11e0]
  end

  def starting_signature_bytes
    4
  end

  def min_trailing_signature_bytes
    6
  end

  def max_trailing_signature_bytes
    18
  end
end
