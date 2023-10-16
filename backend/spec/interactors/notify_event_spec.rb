RSpec.describe NotifyEvent, type: :interactor do
  subject { described_class.call(notify_event_params) }

  let(:notify_event_params) do
    {
      enrollment:,
      event_name: "notify",
      notifier_params: notifier_method_params
    }
  end
  let(:notifier_method_params) do
    {
      comment: "whatever",
      current_user: create(:user)
    }
  end
  let(:enrollment) { create(:enrollment, :api_entreprise) }
  let(:notifier) { instance_double(ApiEntrepriseNotifier, notify: true) }

  before do
    allow(ApiEntrepriseNotifier).to receive(:new).and_return(notifier)
  end

  it { is_expected.to be_a_success }

  it "calls valid notifier, with valid method and valid params" do
    subject

    expect(notifier).to have_received(:notify).with(notifier_method_params)
  end
end
