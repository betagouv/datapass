class UpgradeLeTaxiForm < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        # check new checkbox dpo_is_informed if cgu_approved is checked
        execute <<-SQL
          UPDATE enrollments
          SET dpo_is_informed = TRUE
          WHERE cgu_approved = TRUE
            AND target_api = ANY(ARRAY['le_taxi_chauffeurs', 'le_taxi_clients']);
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET demarche = 'applicatif_chauffeur'
          WHERE target_api = 'le_taxi_chauffeurs';
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET demarche = 'applicatif_client'
          WHERE target_api = 'le_taxi_clients';
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET technical_team_type = 'software_company', technical_team_value = '33244373800056'
          WHERE target_api = 'le_taxi_chauffeurs' AND
            additional_content->>'solution_logicielle' = 'axygest';
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET technical_team_type = 'software_company', technical_team_value = '48767850000017'
          WHERE target_api = 'le_taxi_chauffeurs' AND
            additional_content->>'solution_logicielle' = 'tessa';
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET technical_team_type = 'software_company', technical_team_value = '75213617600019'
          WHERE target_api = 'le_taxi_chauffeurs' AND
            additional_content->>'solution_logicielle' = 'appsolu';
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET technical_team_type = 'internal_team'
          WHERE target_api = 'le_taxi_chauffeurs' AND
            additional_content->>'solution_logicielle' = 'solution_interne';
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET technical_team_type = 'software_company', technical_team_value = additional_content->>'solution_logicielle'
          WHERE target_api = 'le_taxi_chauffeurs' AND
            NOT additional_content->>'solution_logicielle' = ANY(ARRAY['axygest', 'tessa', 'appsolu', 'solution_interne']);
        SQL

        execute <<-SQL
          UPDATE team_members tm2
          SET
            type = 'responsable_technique'
          FROM (
                   SELECT
                       tm.id
                   FROM enrollments e
                   LEFT JOIN team_members tm on tm.enrollment_id = e.id and tm.type = 'contact_metier'
                   WHERE target_api = 'le_taxi_chauffeurs'
               ) AS subquery
          WHERE tm2.id = subquery.id;
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET additional_content = jsonb_build_object()
          WHERE target_api = ANY(ARRAY['le_taxi_chauffeurs', 'le_taxi_clients']);
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET scopes = jsonb_build_object('taxis_management', true, 'hails_management', true)
          WHERE target_api = ANY(ARRAY['le_taxi_chauffeurs', 'le_taxi_clients']);
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET
            target_api = 'le_taxi',
            fondement_juridique_title = 'articles L. 3121-11-1 et R3121-24 à R3121-33 du Code des transports',
            fondement_juridique_url = 'https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000029528684&cidTexte=LEGITEXT000023086525;https://www.legifrance.gouv.fr/affichCode.do?idSectionTA=LEGISCTA000032278146&cidTexte=LEGITEXT000023086525'
          WHERE target_api = ANY(ARRAY['le_taxi_chauffeurs', 'le_taxi_clients']);
        SQL
      end

      dir.down do
      end
    end
  end
end
