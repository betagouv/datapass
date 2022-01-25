class AddUserRefToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_reference :enrollments, :user, foreign_key: true
  end
end

# a manual request was made after this migration:
# UPDATE
#     enrollments AS e
# SET
#     user_id = users_roles.user_id
# FROM
#     enrollments AS e_alias
# INNER JOIN
#     roles ON roles.resource_id = e_alias.id
# INNER JOIN
#     users_roles ON users_roles.role_id = roles.id
# WHERE
#     roles.name = 'applicant'
# AND
#     e.id = e_alias.id;
