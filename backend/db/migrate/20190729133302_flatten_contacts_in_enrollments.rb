class FlattenContactsInEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_reference :enrollments, :dpo, references: :users, index: true
    add_foreign_key :enrollments, :users, column: :dpo_id
    add_column :enrollments, :dpo_label, :string
    add_column :enrollments, :dpo_phone_number, :string
    add_reference :enrollments, :responsable_traitement, references: :users, index: true
    add_foreign_key :enrollments, :users, column: :responsable_traitement_id
    add_column :enrollments, :responsable_traitement_label, :string
    add_column :enrollments, :responsable_traitement_phone_number, :string
  end
end

# manual requests were made after this migration:
#
# -- copy string fields (nom & phone_number)
# update enrollments
# set dpo_label        = subquery.nom,
#     dpo_phone_number = subquery.phone_number
# from (
#          select id, nom, phone_number
#          from (
#                   select id, unnest(contacts) as c
#                   from enrollments
#               ) as c,
#               jsonb_to_record(c) as y(nom text, phone_number text)
#          where c ->> 'id' = 'dpo'
#      ) as subquery
# where enrollments.id = subquery.id;
#
# update enrollments
# set responsable_traitement_label        = subquery.nom,
#     responsable_traitement_phone_number = subquery.phone_number
# from (
#          select id, nom, phone_number
#          from (
#                   select id, unnest(contacts) as c
#                   from enrollments
#               ) as c,
#               jsonb_to_record(c) as y(nom text, phone_number text)
#          where c ->> 'id' = 'responsable_traitement'
#      ) as subquery
# where enrollments.id = subquery.id;
#
# -- user list that does not have an account (create empty user for them)
# insert into users (email, created_at, updated_at, roles, email_verified)
# select y.email, NOW(), NOW(), '{}', false
# from (
#          select id, unnest(contacts) as c
#          from enrollments
#      ) as c,
#      jsonb_to_record(c) as y(nom text, phone_number text, email text)
#          left join users on users.email = y.email
# where users.email is null
#   and c ->> 'id' = 'responsable_traitement'
#   and y.email ~ '^[A-Za-z0-9ç._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'
# group by y.email;
# insert into users (email, created_at, updated_at, roles, email_verified)
# select y.email, NOW(), NOW(), '{}', false
# from (
#          select id, unnest(contacts) as c
#          from enrollments
#      ) as c,
#      jsonb_to_record(c) as y(nom text, phone_number text, email text)
#          left join users on users.email = y.email
# where users.email is null
#   and c ->> 'id' = 'dpo'
#   and y.email ~ '^[A-Za-z0-9ç._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'
# group by y.email;
#
# -- user list that have account (link id for them)
# update enrollments
# set responsable_traitement_id = subquery.user_id
# from (
#          select c.id, y.email, users.id as user_id
#          from (
#                   select id, unnest(contacts) as c
#                   from enrollments
#               ) as c,
#               jsonb_to_record(c) as y(nom text, phone_number text, email text)
#                   inner join users on users.email = y.email
#          where c ->> 'id' = 'responsable_traitement'
#      ) as subquery
# where enrollments.id = subquery.id;
#
# update enrollments
# set dpo_id = subquery.user_id
# from (
#          select c.id, y.email, users.id as user_id
#          from (
#                   select id, unnest(contacts) as c
#                   from enrollments
#               ) as c,
#               jsonb_to_record(c) as y(nom text, phone_number text, email text)
#                   inner join users on users.email = y.email
#          where c ->> 'id' = 'dpo'
#      ) as subquery
# where enrollments.id = subquery.id;
