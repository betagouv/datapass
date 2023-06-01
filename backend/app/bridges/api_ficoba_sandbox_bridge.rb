# frozen_string_literal: true

class ApiFicobaSandboxBridge < SandboxBridge
  def version
    "v1"
  end

  def code
    "FICOBA_API"
  end
end
