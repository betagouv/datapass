CarrierWave.configure do |config|
  config.root = if Rails.env.test?
    Rails.root.join("tmp")
  else
    Rails.root.join("/opt/apps/signup-back")
  end
end
