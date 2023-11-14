RSpec.describe EnrollmentEventsForUserQuery, type: :query do
  subject { described_class.new(enrollment, user).perform }

  let(:enrollment) { create(:enrollment, :api_particulier) }
  let(:user) { create(:user) }

  let!(:basic_events) do
    [
      create(:event, :create, enrollment: enrollment),
      create(:event, :notify, enrollment: enrollment)
    ]
  end

  let!(:restricted_events) do
    [
      create(:event, :opinion_created, enrollment: enrollment)
    ]
  end

  context "when user is an instructor for the target api" do
    let(:user) { create(:instructor, target_api: :api_particulier) }

    it { is_expected.to be_a(ActiveRecord::Relation) }
    it { is_expected.to contain_exactly(*(basic_events + restricted_events)) }
  end

  context "when user is a reporter for the target api" do
    let(:user) { create(:instructor, target_api: :api_particulier) }

    it { is_expected.to be_a(ActiveRecord::Relation) }
    it { is_expected.to contain_exactly(*(basic_events + restricted_events)) }
  end

  context "when user is not related to the target api" do
    let(:user) { create(:user, roles: []) }

    it { is_expected.to be_a(ActiveRecord::Relation) }
    it { is_expected.to contain_exactly(*basic_events) }
  end
end
