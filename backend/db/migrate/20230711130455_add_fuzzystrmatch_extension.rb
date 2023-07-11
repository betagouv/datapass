class AddFuzzystrmatchExtension < ActiveRecord::Migration[6.0]
  def change
    enable_extension "fuzzystrmatch" unless extension_enabled?("fuzzystrmatch")
  end
end
