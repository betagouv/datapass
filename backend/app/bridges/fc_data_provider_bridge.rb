class FcDataProviderBridge < ApplicationBridge
  include FcDataProviderMethods

  def call
    notify_support_franceconnect
  end
end
