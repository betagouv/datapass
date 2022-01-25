class RenameRolesToEvents < ActiveRecord::Migration[5.1]
  def change
    add_reference :roles, :user, foreign_key: true
    add_reference :roles, :enrollment, foreign_key: true
    remove_column :roles, :resource_type
    add_column :roles, :comment, :string
    rename_table :roles, :events
  end
end

# manual requests were made after this migration:
#  DELETE FROM events
#  WHERE name = 'technical_inputs_sender' OR name = 'application_deployer';
#
# UPDATE events
# SET name = CASE name
#   WHEN 'application_sender' THEN 'submitted'
#   WHEN 'applicant' THEN 'created'
#   WHEN 'application_validater' THEN 'validated'
#   WHEN 'application_reviewer' THEN 'asked_for_modification'
#   WHEN 'application_refuser' THEN 'refused'
#   ELSE name
# END;
#
# UPDATE events
# SET enrollment_id = resource_id
# WHERE exists (SELECT 1 FROM enrollments e WHERE e.id = events.resource_id);
#
# UPDATE
#     events AS e
# SET
#     user_id = users_roles.user_id
# FROM
#     events AS e_alias
# INNER JOIN
#     users_roles ON users_roles.role_id = e_alias.id
# WHERE
#     e.id = e_alias.id;
#
#
# # merge messages in events
# SELECT events.id as event_id, events.name, events.enrollment_id, events.created_at as event_date,
#   messages.created_at as message_date, messages.id as message_id, substring(messages.content from 1 for 20)
# FROM events
# INNER JOIN messages ON messages.enrollment_id = events.enrollment_id
#   AND @extract(epoch from messages.created_at - events.created_at) <= 1;
#
# UPDATE events AS e
# SET comment = m.content
# FROM events AS e_alias
# INNER JOIN messages m ON m.enrollment_id = e_alias.enrollment_id
#   AND @extract(epoch from m.created_at - e_alias.created_at) <= 1
# WHERE e.id = e_alias.id;
#
# # these messages are harder to link and must be dealed with manually
# ## list all messages that do not have a match in the events table
# SELECT messages.enrollment_id, messages.created_at as message_date, messages.id as message_id,
#   substring(messages.content from 1 for 20)
# FROM messages
# WHERE not exists (
#   SELECT 1
#   FROM events
#   WHERE messages.enrollment_id = events.enrollment_id
#     AND @extract(epoch from messages.created_at - events.created_at) <= 1
# );
#
# ## get all events associated with the messages listed above
# SELECT *
# FROM events
# WHERE enrollment_id IN (
#   SELECT messages.enrollment_id
#   FROM messages
#   WHERE not exists (
#     SELECT 1
#     FROM events
#     WHERE messages.enrollment_id = events.enrollment_id
#       AND @extract(epoch from messages.created_at - events.created_at) <= 1
#   )
# )
# ORDER BY enrollment_id, created_at;
#
# ## manually copy comment
# UPDATE events AS e
# SET
#   comment = m.content,
#   created_at = m.created_at,
#   updated_at = m.updated_at
# FROM messages AS m
# WHERE m.enrollment_id = e.enrollment_id
# AND m.id = 'message_id'
# AND e.id = 'event_id';
#
# ## manually create event
# INSERT INTO events (name, user_id, enrollment_id)
# VALUES ('asked_for_modification', 'user_id', 'enrollment_id')
# RETURNING *;
