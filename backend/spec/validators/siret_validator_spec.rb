class SiretFormatValidatable
  include ActiveModel::Validations
  attr_accessor :siret

  validates :siret, siret: true
end

RSpec.describe SiretValidator do
  subject { SiretFormatValidatable.new }

  let(:valid_siret) { "13002526500013" }
  let(:invalid_siret) { "12345678901234" }
  let(:la_poste_siret) { "35600000000048" }

  it "validates la poste siret" do
    subject.siret = la_poste_siret

    expect(subject).to be_valid
  end

  it "validates siret that has 14 digits" do
    subject.siret = valid_siret

    expect(subject).to be_valid
  end

  it "rejects siret that does not have 14 digits" do
    subject.siret = "1234567891234567"

    expect(subject).not_to be_valid
  end

  it "rejects siret that have 14 chars long including a letter" do
    subject.siret = "1234567891234A"

    expect(subject).not_to be_valid
  end

  it "rejects siret that have 14 digits but no good checksum" do
    subject.siret = invalid_siret

    expect(subject).not_to be_valid
  end

  it "rejects siret with whitespaces" do
    subject.siret = "\t\r\n#{valid_siret}"

    expect(subject).not_to be_valid
  end

  it "rejects siret which have no good checksum but match la poste siren" do
    subject.siret = "12345356000000"

    expect(subject).not_to be_valid
  end
end
