# frozen_string_literal: true

class ApiImpotParticulierFcSandboxBridge < SandboxBridge
  include FcDataProviderMethods

  def libelle_cgu
    "cgu_api_impot_particulier_bac_a_sable_connexion_fc_septembre2020_v2.6"
  end

  def version_cgu
    "v2.6"
  end

  def version
    "1.0"
  end

  def code
    "Impôt_Particulier"
  end

  def call
    super

    notify_support_franceconnect
  end
end
