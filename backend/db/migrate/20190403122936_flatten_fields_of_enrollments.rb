class FlattenFieldsOfEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :intitule, :string
    add_column :enrollments, :description, :string
    add_column :enrollments, :fondement_juridique_title, :string
    add_column :enrollments, :fondement_juridique_url, :string
    add_column :enrollments, :data_retention_period, :integer
    add_column :enrollments, :data_recipients, :string
  end
end

# manual requests were made after this migration:
#
# UPDATE enrollments SET fondement_juridique_url = demarche->>'url_fondement_juridique';
# UPDATE enrollments SET fondement_juridique_title = demarche->>'fondement_juridique';
# UPDATE enrollments SET intitule = demarche->>'intitule';
# UPDATE enrollments SET description = demarche->>'description';
#
# SELECT donnees->'conservation', COUNT(*) FROM enrollments GROUP BY donnees->'conservation';
# SELECT donnees->'conservation', COUNT(*) FROM enrollments WHERE donnees->'conservation' = '""' GROUP BY donnees->'conservation';
# UPDATE enrollments SET donnees = jsonb_set(donnees, '{conservation}', '"0"') WHERE donnees->'conservation' = '""' ;
#
# UPDATE enrollments SET data_retention_period = (donnees->>'conservation')::int;
# WITH agg_recipients AS (
#   SELECT id, string_agg(value, ', ') FROM (
#     SELECT id, value
#     FROM enrollments, jsonb_each_text(donnees->'destinataires')
#     GROUP BY jsonb_each_text.value, id
#     ) e
#   GROUP BY id
# )
# UPDATE enrollments
# SET data_recipients = agg_recipients.string_agg
# FROM agg_recipients
# WHERE enrollments.id = agg_recipients.id;
