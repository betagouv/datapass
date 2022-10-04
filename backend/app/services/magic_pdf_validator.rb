class MagicPdfValidator < MagicValidator
  # from : https://www.garykessler.net/library/file_sigs.html
  # 0A 25 25 45 4F 46 (.%%EOF)
  # 0A 25 25 45 4F 46 0A (.%%EOF.)
  # 0D 0A 25 25 45 4F 46 0D 0A (..%%EOF..)
  # 0D 25 25 45 4F 46 0D (.%%EOF.)

  def valid_trailing_signatures
    %w[0a2525454f46 0a2525454f460a 0d0a2525454f460d0a 0d2525454f460d 2525454f460d0a]
  end

  def valid_starting_signature
    "25504446"
  end

  def starting_signature_bytes
    4
  end

  def min_trailing_signature_bytes
    6
  end

  def max_trailing_signature_bytes
    9
  end
end
