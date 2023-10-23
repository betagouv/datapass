RSpec.describe Event, type: :model do
  it "has valid factory" do
    expect(build(:event)).to be_valid

    %i[
      create
      update
      notify
      validate
      refuse
      revoke
      request_changes
      reminder
      reminder_before_archive
      archive
      opinion_created
    ].each do |trait|
      expect(build(:event, trait)).to be_valid
    end
  end

  describe "#mark_as_notify_from_demandeur" do
    let(:enrollment) { create(:enrollment, :api_particulier, :draft) }
    let(:instructor) { create(:user, roles: ["api_particulier:instructor", "api_particulier:reporter"]) }

    context "when event notify is created by demandeur" do
      let(:demandeur_notify) do
        create(
          :event,
          name: :notify,
          enrollment_id: enrollment.id,
          user_id: enrollment.demandeurs.first.user_id,
          comment: "some comment"
        )
      end

      it "is expected to have a is_notify_from_demandeur field at true" do
        expect(demandeur_notify.is_notify_from_demandeur).to be(true)
      end
    end

    context "when event notify is created by instructor" do
      let(:instructor_notify) do
        create(
          :event,
          name: :notify,
          enrollment_id: enrollment.id,
          user_id: instructor.id,
          comment: "some other comment"
        )
      end

      it "is expected to have a is_notify_from_demandeur field at false" do
        expect(instructor_notify.is_notify_from_demandeur).to be(false)
      end
    end
  end

  describe "#mark_as_processed" do
    let(:enrollment) { create(:enrollment, :api_particulier, :draft) }

    subject do
      create(
        :event,
        name: :notify,
        enrollment_id: enrollment.id,
        user_id: enrollment.demandeurs.first.user_id,
        comment: "some comment"
      )
    end

    context "when event notify is created" do
      it "is expected to have a processed_at field at nil" do
        expect(subject.processed_at).to be(nil)
      end
    end

    context "when event notify is #mark_as_processed" do
      it "is expected to have a processed_at field not nil" do
        subject.mark_as_processed

        expect(subject.processed_at).to_not be(nil)
      end
    end
  end

  describe "entity validation" do
    subject { event }

    context "when event does not require an entity" do
      let(:event) { build(:event, name: "archive") }

      it { is_expected.to be_valid }
    end

    context "when event has a name related to opinions" do
      let(:event) { build(:event, name: "opinion_created", entity:) }

      context "when entity is not present" do
        let(:entity) { nil }

        it { is_expected.to be_invalid }
      end

      context "when entity is present" do
        context "when entity is not an Opinion" do
          let(:entity) { build(:enrollment) }

          it { is_expected.to be_invalid }
        end

        context "when entity is an Opinion" do
          let(:entity) { build(:opinion) }

          it { is_expected.to be_valid }
        end
      end
    end
  end

  describe "comment validation" do
    subject { event }

    let(:event) { build(:event, name: name, comment: comment) }
    describe "events which require comment presence" do
      %w[
        refuse
        request_changes
        validate
        revoke
        notify
      ].each do |name|
        context "when name is '#{name}'" do
          let(:name) { name }

          context "when comment is present" do
            let(:comment) { "I like trains" }

            it { is_expected.to be_valid }
          end

          context "when comment is nil" do
            let(:comment) { nil }

            it { is_expected.not_to be_valid }
          end
        end
      end
    end

    describe "events which do not require comment presence" do
      %w[
        create
        update
        submit
        reminder
        reminder_before_archive
        archive
      ].each do |name|
        context "when name is '#{name}'" do
          let(:name) { name }

          context "when comment is present" do
            let(:comment) { "I like trains" }

            it { is_expected.to be_valid }
          end

          context "when comment is nil" do
            let(:comment) { nil }

            it { is_expected.to be_valid }
          end
        end
      end
    end
  end

  describe "user validation" do
    subject { event }

    let(:event) { build(:event, name: name, user: user, comment: comment) }

    describe "events which require user presence" do
      %w[
        create
        update
        notify
        validate
        refuse
        revoke
        request_changes
      ].each do |name|
        context "when name '#{name}'" do
          let(:name) { name }
          let(:comment) { "I like trains" }

          context "when user is present" do
            let(:user) { create(:user) }

            it { is_expected.to be_valid }
          end

          context "when user is nil" do
            let(:user) { nil }

            it { is_expected.not_to be_valid }
          end
        end
      end
    end

    describe "events which not require user presence" do
      %w[
        reminder
        reminder_before_archive
      ].each do |name|
        context "when name '#{name}'" do
          let(:name) { name }
          let(:comment) { nil }

          context "when user is present" do
            let(:user) { create(:user) }

            it { is_expected.to be_valid }
          end

          context "when user is nil" do
            let(:user) { nil }

            it { is_expected.to be_valid }
          end
        end
      end
    end
  end
end
