class CleanPhoneNumbersInTeamMembers < ActiveRecord::Migration[7.0]
  def up
    TeamMember.find_each do |team_member|
      cleaned_phone_number = team_member.phone_number.gsub(/\D/, "") unless team_member.phone_number.nil?
      team_member.update_column(:phone_number, cleaned_phone_number)
    end
  end

  def down
    # The down method is intentionally left blank because the changes made in the up method can't be reversed.
  end
end
