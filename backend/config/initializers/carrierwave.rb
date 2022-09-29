CarrierWave.configure do |config|
  config.root = if Rails.env.test?
    Rails.root.join("tmp")
  elsif ENV["UPLOAD_FOLDER"]
    Rails.root.join(ENV["UPLOAD_FOLDER"])
  else
    Rails.root.join("/opt/apps/datapass-backend")
  end
end
