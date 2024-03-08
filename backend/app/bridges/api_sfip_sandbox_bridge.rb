# frozen_string_literal: true

class ApiSfipSandboxBridge < SandboxBridge
  def libelle_cgu
    "cgu_api_impot_particulier_bac_a_sable_connexion_hors_fc_septembre2020_v2.6"
  end

  def version_cgu
    "v2.6"
  end

  def version
    "v1"
  end

  def code
    "SFiP"
  end
end
