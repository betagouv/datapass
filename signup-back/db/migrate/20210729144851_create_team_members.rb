class CreateTeamMembers < ActiveRecord::Migration[5.2]
  def change
    create_table :team_members do |t|
      t.string "email"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.string "family_name"
      t.string "given_name"
      t.string "phone_number"
      t.string "job"
      t.string "type"
      t.references :enrollment, foreign_key: true, index: true
      t.references :user, foreign_key: true, index: true
    end

    reversible do |dir|
      # move jsonb[] contacts to team_members table
      dir.up do
        execute <<-SQL
          INSERT INTO team_members (enrollment_id, email, family_name, given_name, job, type, phone_number, created_at, updated_at)
          select enrollment_id, email, family_name, given_name, job, CASE WHEN id='technique' THEN 'responsable_technique' WHEN id='metier' THEN 'contact_metier' END as type, phone_number, timestamp 'epoch', timestamp 'epoch'
          from (
              select id as enrollment_id, unnest(contacts) as c
              from enrollments e
          ) as c,
          jsonb_to_record(c) as y(
              email text,
              family_name text,
              given_name text,
              job text,
              id text,
              phone_number text
          ) where email is not null and email <> '' and id in ('technique', 'metier');
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end

    remove_column "enrollments", :contacts, :jsonb, array: true

    reversible do |dir|
      # move responsable traitement to team_members table
      dir.up do
        execute <<-SQL
          INSERT INTO team_members (enrollment_id, email, family_name, given_name, job, type, phone_number, created_at, updated_at, user_id)
          select enrollment_id, email, family_name, given_name, job, 'responsable_traitement', phone_number, timestamp 'epoch', timestamp 'epoch', user_id
          from (
              select
                e.id as enrollment_id,
                rt.email as email,
                responsable_traitement_family_name as family_name,
                responsable_traitement_given_name as given_name,
                responsable_traitement_job as job,
                responsable_traitement_phone_number as phone_number,
                rt.id as user_id
              from enrollments e
              inner join users rt on rt.id = e.responsable_traitement_id
          ) as c where email is not null;
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
    reversible do |dir|
      # move move dpd to team_members table
      dir.up do
        execute <<-SQL
          INSERT INTO team_members (enrollment_id, email, family_name, given_name, job, type, phone_number, created_at, updated_at, user_id)
          select enrollment_id, email, family_name, given_name, job, 'delegue_protection_donnees', phone_number, timestamp 'epoch', timestamp 'epoch', user_id
          from (
              select
                e.id as enrollment_id,
                dpd.email as email,
                dpo_family_name as family_name,
                dpo_given_name as given_name,
                dpo_job as job,
                dpo_phone_number as phone_number,
                dpd.id as user_id
              from enrollments e
              inner join users dpd on dpd.id = e.dpo_id
          ) as c where email is not null;
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end

    reversible do |dir|
      dir.up do
        remove_foreign_key :enrollments, column: :dpo_id
      end
      dir.down do
        add_foreign_key :enrollments, :users, column: :dpo_id
      end
    end
    remove_reference :enrollments, :dpo, references: :users, index: true
    remove_column :enrollments, :dpo_family_name, :string
    remove_column :enrollments, :dpo_phone_number, :string
    reversible do |dir|
      dir.up do
        remove_foreign_key :enrollments, column: :responsable_traitement_id
      end
      dir.down do
        add_foreign_key :enrollments, :users, column: :responsable_traitement_id
      end
    end
    remove_reference :enrollments, :responsable_traitement, references: :users, index: true
    remove_column :enrollments, :responsable_traitement_family_name, :string
    remove_column :enrollments, :responsable_traitement_phone_number, :string
    remove_column :enrollments, :dpo_given_name, :string
    remove_column :enrollments, :dpo_job, :string
    remove_column :enrollments, :responsable_traitement_given_name, :string
    remove_column :enrollments, :responsable_traitement_job, :string

    reversible do |dir|
      # move owner to team_members table
      dir.up do
        execute <<-SQL
          INSERT INTO team_members (enrollment_id, email, family_name, given_name, job, type, phone_number, created_at, updated_at, user_id)
          select enrollment_id, email, family_name, given_name, job, 'demandeur', phone_number, timestamp 'epoch', timestamp 'epoch', user_id
          from (
              select
                e.id as enrollment_id,
                u.email as email,
                u.family_name as family_name,
                u.given_name as given_name,
                u.job as job,
                u.phone_number as phone_number,
                u.id as user_id
              from enrollments e
              inner join users u on u.id = e.user_id
          ) as c where email is not null;
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
    reversible do |dir|
      dir.up do
        remove_foreign_key :enrollments, column: :user_id
      end
      dir.down do
        add_foreign_key :enrollments, :users, column: :user_id
      end
    end
    remove_reference :enrollments, :user, references: :users, index: true
  end
end
