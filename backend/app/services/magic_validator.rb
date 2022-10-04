# from https://kgrz.io/robust-file-validations-in-ruby.html
class MagicValidator
  attr_reader :file
  attr_reader :starting_signature, :trailing_signature

  def initialize(file)
    raise "Expecting a file object as an argument" unless file.is_a?(File)

    # Ensure there are sufficient number of bytes to determine the
    # signatures. If this check is not present, an empty text file
    # masquerading as a PDF file will throw EOF Errors while reading the
    # bytes.
    if file.stat.size < minimum_bytes_for_determining_signature
      raise "File too small to calculate signature"
    end

    @file = file
    process_file!
  end

  def valid_trailing_signatures
    raise ::NotImplementedError
  end

  def valid_starting_signature
    raise ::NotImplementedError
  end

  def starting_signature_bytes
    raise ::NotImplementedError
  end

  def min_trailing_signature_bytes
    raise ::NotImplementedError
  end

  def max_trailing_signature_bytes
    raise ::NotImplementedError
  end

  def valid?
    starting_signature_valid? && trailing_signature_valid?
  end

  private

  def minimum_bytes_for_determining_signature
    starting_signature_bytes + min_trailing_signature_bytes
  end

  def process_file!
    read_starting_signature!
    read_trailing_signature!

    # Ensure the file is closed after reading the starting and trailing
    # bytes
    @file.close
  end

  def read_starting_signature!
    @file.rewind
    starting_bytes = @file.readpartial(starting_signature_bytes)
    @starting_signature = starting_bytes.unpack1("H*")
  end

  def read_trailing_signature!
    @file.rewind
    @file.seek(max_trailing_signature_bytes * -1, IO::SEEK_END)
    trailing_bytes = @file.read
    @trailing_signature = trailing_bytes.unpack1("H*")
  end

  def starting_signature_valid?
    @starting_signature.start_with?(*valid_starting_signature)
  end

  def trailing_signature_valid?
    @trailing_signature.end_with?(*valid_trailing_signatures)
  end
end
