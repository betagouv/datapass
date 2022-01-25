class AddResourceProviderTypeToResourceProviders < ActiveRecord::Migration[5.1]
  def change
    add_column :resource_providers, :resource_provider_type, :string
  end
end
