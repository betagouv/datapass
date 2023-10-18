class CleanUpOldApiTpDraftEnrollments < ActiveRecord::Migration[7.0]
  def up
    enrollments = Enrollment.where(status: "draft", target_api: "api_tiers_de_prestation").where("created_at < ?", Date.parse("2023-08-15"))
    enrollments.find_each(&:destroy)
  end

  def down
  end
end
