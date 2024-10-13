# frozen_string_literal: true

class ApiImpotParticulierFcProductionBridge < ProductionBridge
  include FcDataProviderMethods

  def libelle_cgu
    "cgu_api_impot_particulier_production_connexion_fc_septembre2020_v5.5.pdf"
  end

  def version_cgu
    "v5.5"
  end

  def call
    super

    notify_support_franceconnect
  end
end
