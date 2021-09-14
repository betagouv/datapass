class UpdateEidasLevelStructureInEnrollments < ActiveRecord::Migration[5.2]
  def change
    # Convert enrollments where level eIDAS 2 is selected
    Enrollment.connection.execute("
      UPDATE enrollments
      SET additional_content = additional_content || jsonb '{
        \"eidas_level\": \"2\"
      }' #- '{eidas_1}' #- '{eidas_2}'
      WHERE target_api = 'franceconnect'
      AND additional_content->>'eidas_2' = 'true';
    ")
    # Convert enrollments where level eIDAS 1 is selected
    Enrollment.connection.execute("
      UPDATE enrollments
      SET additional_content = additional_content || jsonb '{
        \"eidas_level\": \"1\"
      }' #- '{eidas_1}' #- '{eidas_2}'
      WHERE target_api = 'franceconnect'
      AND additional_content->>'eidas_1' = 'true';
    ")
  end
end
