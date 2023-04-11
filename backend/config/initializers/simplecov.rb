if ENV["COVERAGE"] && ENV["RAILS_ENV"] == "test"
  require "simplecov"

  SimpleCov.start "rails" do
    add_group "Serializers", "app/serializers"
    add_group "Policies", "app/policies"
    add_group "Bridges", "app/bridges"
    add_group "Services", "app/services"
    add_group "Uploaders", "app/services"
  end
end
