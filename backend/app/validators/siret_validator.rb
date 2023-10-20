class SiretValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    validate_length_and_digits_only(record, attribute, value)
    validate_structure(record, attribute, value)
  end

  def validate_length_and_digits_only(record, attribute, value)
    record.errors.add(attribute, :format, message: "ne possède pas 14 chiffres") unless /\A\d{14}\z/.match?(value)
  end

  def validate_structure(record, attribute, value)
    record.errors.add(attribute, :checksum, message: "ne respecte pas la formule de Luhn ou n'est pas un siret de La Poste") unless !value.nil? && valid_checksum(value)
  end

  private

  def valid_checksum(value)
    la_poste_siret?(value) ||
      valid_luhn_checksum?(value)
  end

  def la_poste_siret?(value)
    value =~ /^356000000\d{5}/
  end

  def valid_luhn_checksum?(value)
    (luhn_checksum(value) % 10).zero?
  end

  def luhn_checksum(value)
    accum = 0
    value.reverse.each_char.map(&:to_i).each_with_index do |digit, index|
      t = index.even? ? digit : digit * 2
      t -= 9 if t >= 10
      accum += t
    end
    accum
  end
end
