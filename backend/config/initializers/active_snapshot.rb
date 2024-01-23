ActiveSupport.on_load(:active_record) do
  ActiveSnapshot.config do |config|
    config.storage_method = "native_json"
  end
end
