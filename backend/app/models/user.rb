class User < ActiveRecord::Base
  devise :omniauthable, omniauth_providers: [:api_gouv]
  has_paper_trail on: [:update], only: [:roles]

  validates :email,
    uniqueness: true,
    format: {
      with: URI::MailTo::EMAIL_REGEXP,
      message: "Vous devez renseigner un email valide"
    }

  before_save :downcase_email, if: :will_save_change_to_email?

  has_many :team_members
  has_many :enrollments, through: :team_members
  has_many :events

  scope :with_at_least_one_role, -> { where("roles <> '{}'") }

  def self.reconcile(external_user_info)
    user = where(
      email: external_user_info["email"].downcase.strip
    ).first_or_create!

    # the following data must be used as a cache (do not modify them, use fresh data form api-auth whenever you can)
    user.uid = external_user_info["sub"] if external_user_info.key?("sub")
    user.assign_attributes(
      external_user_info.slice(
        "email_verified",
        "family_name",
        "given_name",
        "phone_number",
        "job",
        "organizations"
      )
    )
    user.save

    user
  end

  def is_demandeur?(enrollment)
    enrollment.demandeurs.any? { |demandeur| demandeur.user == self }
  end

  def is_member?(enrollment)
    enrollment.team_members.any? { |team_member| team_member.user == self }
  end

  def belongs_to_organization?(enrollment)
    organizations.any? do |o|
      o["id"] == enrollment.organization_id ||
        (
          !enrollment.organization_id.present? &&
            enrollment.previous_enrollment_id.present? &&
            o["id"] == enrollment.previous_enrollment.organization_id
        )
    end
  end

  def is_instructor?(target_api)
    roles.include? "#{target_api}:instructor"
  end

  def is_reporter?(target_api)
    roles.include?("#{target_api}:reporter")
  end

  def is_administrator?
    roles.include?("administrator")
  end

  protected

  def downcase_email
    self.email = email.downcase.strip
  end
end
