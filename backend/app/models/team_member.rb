class TeamMember < ApplicationRecord
  # enable Single Table Inheritance with a snake_case value as discriminatory field
  class << self
    # ex: 'responsable_technique' => TeamMember::ResponsableTechnique
    def find_sti_class(type)
      "TeamMember::#{type.underscore.classify}".constantize
    end

    # ex: > TeamMember::ResponsableTechnique => 'responsable_technique'
    def sti_name
      name.demodulize.underscore
    end
  end

  before_validation :remove_non_ascii_from_phone_number
  belongs_to :enrollment
  belongs_to :user, optional: true
  before_save :set_user, if: :will_save_change_to_email?

  validates :email,
    format: {
      with: URI::MailTo::EMAIL_REGEXP,
      message: "Vous devez renseigner un email valide"
    }, allow_blank: true

  def has_linked_user
    true
  end

  def remove_non_ascii_from_phone_number
    self.phone_number = phone_number&.gsub(/[^\x20-\x7E]/, "") unless phone_number.nil?
  end

  protected

  def set_user
    self.user = if has_linked_user && email.present?
      User.reconcile({"email" => email})
    end
  end
end
