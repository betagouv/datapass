class UsersEmailToLowerCase < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
      UPDATE users
      SET email = LOWER(users.email)
      FROM (
               SELECT email
               FROM users
                        LEFT OUTER JOIN (
                   SELECT LOWER(email) as lower_email
                   FROM users GROUP BY LOWER(email) HAVING COUNT(*) > 1
               ) dup ON dup.lower_email = LOWER(users.email)
               WHERE dup.lower_email IS NULL
           ) AS non_dup
      WHERE users.email = non_dup.email;
        SQL
        execute <<-SQL
          UPDATE team_members
          SET email = LOWER(team_members.email);
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
