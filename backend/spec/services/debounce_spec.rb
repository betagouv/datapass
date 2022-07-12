RSpec.describe Debounce, type: :service do
  subject { described_class.new(email).call }

  before do
    stub_const("ENV", ENV.to_hash.merge("DO_NOT_VALIDATE_MAIL" => "False"))
    stub_debounce_is_safe_to_send_call(email)
  end

  context "for an throwable email" do
    let(:email) { "monemail@yopmail.com" }

    it "is not safe to send" do
      expect(subject).to eq(false)
    end
  end

  context "for an government email" do
    let(:email) { "monemail@gouv.fr" }

    it "is safe to send" do
      expect(subject).to eq(true)
    end
  end
end
