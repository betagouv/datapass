class UpgradeDgfipFormFirstStep < ActiveRecord::Migration[5.2]
  include ::MigrateDgfipForm

  def change
    reversible do |dir|
      dir.up do
        move_production_data_to_sandbox(%w[api_hermes api_e_contacts api_opale api_mire api_ocfi api_e_pro api_robf api_cpr_pro api_infinoe])
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
