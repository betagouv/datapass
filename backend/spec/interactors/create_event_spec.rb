RSpec.describe CreateEvent, type: :interactor do
  subject { described_class.call(enrollment:, current_user:, event_name:) }

  let(:enrollment) { create(:enrollment, :api_entreprise) }
  let(:current_user) { create(:user) }
  let(:event_name) { "create" }

  it { is_expected.to be_a_success }

  it { expect(subject.event).to be_a(Event) }

  it "creates an event with valid attributes" do
    expect {
      subject
    }.to change(Event, :count).by(1)

    last_event = Event.last

    expect(last_event.enrollment).to eq(enrollment)
    expect(last_event.user).to eq(current_user)
    expect(last_event.name).to eq(event_name)
  end
end
