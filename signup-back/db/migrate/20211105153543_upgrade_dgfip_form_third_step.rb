class UpgradeDgfipFormThirdStep < ActiveRecord::Migration[5.2]
  include ::MigrateDgfipForm

  def change
    reversible do |dir|
      dir.up do
        move_production_data_to_sandbox(%w[api_impot_particulier api_impot_particulier_fc])

        move_access_mode_to_additional_content("api_impot_particulier_sandbox", "acces_spi")
        move_access_mode_to_additional_content("api_impot_particulier_sandbox", "acces_etat_civil")
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
