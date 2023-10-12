def upload_on_ovh_s3?
  %w[
    ovh_access_key_id
    ovh_secret_access_key
    ovh_region
    ovh_bucket
  ].all? { |key| ENV[key.upcase].present? }
end

CarrierWave.configure do |config|
  if upload_on_ovh_s3?
    config.storage = :aws
    config.aws_bucket = ENV.fetch("OVH_BUCKET")
    config.aws_acl = "private"

    config.aws_credentials = {
      endpoint: "https://s3.#{ENV.fetch("OVH_REGION").downcase}.io.cloud.ovh.net/",
      access_key_id: ENV.fetch("OVH_ACCESS_KEY_ID"),
      secret_access_key: ENV.fetch("OVH_SECRET_ACCESS_KEY"),
      region: ENV.fetch("OVH_REGION").downcase
    }
  else
    config.storage = :file
    config.root = Rails.env.test? ? Rails.root.join("tmp") : Rails.root.join("public")
  end
end
