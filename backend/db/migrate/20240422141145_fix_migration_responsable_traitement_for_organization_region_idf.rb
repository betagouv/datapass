class FixMigrationResponsableTraitementForOrganizationRegionIdf < ActiveRecord::Migration[7.0]
  ENROLLMENT_IDF_SIRET = "23750007900312" # SIRET de la région IDF
  ENROLLMENT_ID_WITHOUT_IDF_SIRET = [1681, 1701].freeze

  def up
    return unless responsable_traitement_attributes.present?

    TeamMember.joins(:enrollment).where(enrollment: {siret: ENROLLMENT_IDF_SIRET}).where(type: "responsable_traitement").update_all(responsable_traitement_attributes)
    TeamMember.joins(:enrollment).where(enrollment: {id: ENROLLMENT_ID_WITHOUT_IDF_SIRET}).where(type: "responsable_traitement").update_all(responsable_traitement_attributes)
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end

  private

  def responsable_traitement_attributes
    Credentials.get(:responsable_traitement_attributes_idf)
  end
end
