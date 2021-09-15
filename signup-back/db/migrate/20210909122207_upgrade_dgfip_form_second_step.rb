class UpgradeDgfipFormSecondStep < ActiveRecord::Migration[5.2]
  include ::MigrateDgfipForm

  def change
    reversible do |dir|
      dir.up do
        move_production_data_to_sandbox(%w[api_r2p api_ficoba])

        move_access_mode_to_additional_content("api_ficoba_sandbox", "acces_ficoba_iban")
        move_access_mode_to_additional_content("api_ficoba_sandbox", "acces_ficoba_spi")
        move_access_mode_to_additional_content("api_ficoba_sandbox", "acces_ficoba_siren")
        move_access_mode_to_additional_content("api_ficoba_sandbox", "acces_ficoba_personne_physique")
        move_access_mode_to_additional_content("api_ficoba_sandbox", "acces_ficoba_personne_morale")

        move_access_mode_to_additional_content("api_r2p_sandbox", "acces_etat_civil_restitution_spi")
        move_access_mode_to_additional_content("api_r2p_sandbox", "acces_spi")
        move_access_mode_to_additional_content("api_r2p_sandbox", "acces_etat_civil_et_adresse")
        move_access_mode_to_additional_content("api_r2p_sandbox", "acces_etat_civil")
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
