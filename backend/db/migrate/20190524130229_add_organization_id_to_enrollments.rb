class AddOrganizationIdToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :organization_id, :integer
  end
end

# Some SQL operations were made after this migration
#
# -- NOTE THAT THE FOLLOWING ENROLLMENT WILL NOT BE VISIBLE FROM THEIR OWNER ANYMORE
#
# SELECT enrollments.id, enrollments.siret, users.uid, users.email, enrollments.status, enrollments.updated_at
# FROM enrollments
# INNER JOIN users ON users.id = enrollments.user_id
# WHERE enrollments.siret !~ '^\d{14}$'
# ORDER BY enrollments.updated_at desc;
#
# -- # IMPORT ORGANIZATION
#
# COPY (
#     SELECT DISTINCT siret
#     FROM enrollments
#     WHERE siret ~ '^\d{14}$'
# ) TO STDOUT
# CSV DELIMITER ',' HEADER;
#
# COPY organizations (siret) FROM STDIN DELIMITER ',' CSV HEADER;
# -- then enter the output from the previous command
#
# -- # LINK USER TO ORGANIZATIONS
#
# -- ## LIST USER_ID & SIRET PAIRS
#
# COPY (
#     SELECT DISTINCT users.uid AS user_id, enrollments.siret
#     FROM enrollments
#     INNER JOIN users ON users.id = enrollments.user_id
#     WHERE enrollments.siret ~ '^\d{14}$'
#     ) TO STDOUT
# CSV DELIMITER ',' HEADER;
#
# -- ## IMPORT USER ORGANIZATION LINKS
#
# INSERT INTO users_organizations ( user_id, organization_id ) VALUES('uid', (SELECT id FROM organizations WHERE siret = 'siret'));
#
# -- # IMPORT ORGANIZATION_ID IN DATA PASS
#
# COPY (
#     select * from organizations
# ) TO STDOUT
# CSV DELIMITER ',' HEADER;
#
# UPDATE enrollments SET organization_id = 'organization_id' WHERE siret = 'siret';
#
# -- # ADD ORGANIZATION TO ADMIN USERS
#
# COPY (
#     select id, email, roles from users where roles <> '{}'
# ) TO STDOUT
# CSV DELIMITER ',' HEADER;
#
# INSERT INTO users_organizations ( user_id, organization_id ) VALUES('user_id', 'organization_id');
