# frozen_string_literal: true

class ProductionBridge < ApplicationBridge
  def call
    demandeur = @enrollment.demandeurs.first

    linked_token_manager_id = create_enrollment_in_token_manager(
      @enrollment.id,
      demandeur
      # responsable_technique,
      # siret,
      # created_at,
      # submit_event,
      # validated_at,
      # cas_usage_libelle,
      # cas_usage_detail,
      # cadre_juridique_title,
      # fondement_juridique_url,
      # url_document_juridique,
      # rgpd_destinataires,
      # duree_conservation_donnee_valeur,
      # responsable_traitement,
      # dpd
    )
    @enrollment.update({linked_token_manager_id: linked_token_manager_id})
  end

  def create_enrollment_in_token_manager
  end
end
