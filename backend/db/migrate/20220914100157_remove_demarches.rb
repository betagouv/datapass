class RemoveDemarches < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE enrollments
          SET demarche = 'bl-enfance-berger-levrault-cnaf'
          WHERE demarche = 'bl-enfance-berger-levrault-cnaf-dgfip';
        SQL
        execute <<-SQL
          UPDATE enrollments
          SET demarche = 'city-family-mushroom-software-cnaf'
          WHERE demarche = 'city-family-mushroom-software-CNAF-DGFIP';
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
