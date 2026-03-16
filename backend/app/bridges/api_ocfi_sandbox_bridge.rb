# frozen_string_literal: true

class ApiOcfiSandboxBridge < SandboxBridge
  def libelle_cgu
    "cgu_api_ocfi_pcr_bas_2021_v1.0"
  end

  def version_cgu
    "v1.0"
  end

  def version
    "v1"
  end

  def code
    "OCFI"
  end
end
