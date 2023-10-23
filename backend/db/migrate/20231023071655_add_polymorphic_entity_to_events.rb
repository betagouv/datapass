class AddPolymorphicEntityToEvents < ActiveRecord::Migration[7.0]
  def change
    add_reference :events, :entity, polymorphic: true
  end
end
