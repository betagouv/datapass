class TurnScopesIntoAnArray < ActiveRecord::Migration[7.0]
  def up
    Enrollment.all.each do |enrollment|
      # we use update_column to skip update validation callback
      enrollment.update_column(:scopes, enrollment[:scopes].reject { |k, v| !v }.keys)
    end

    execute <<-SQL
      CREATE OR REPLACE FUNCTION public.jsonb_array_to_text_array(_js jsonb)
        RETURNS text[]
        LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT AS
      'SELECT ARRAY(SELECT jsonb_array_elements_text(_js))';
    SQL

    execute <<-SQL
      ALTER TABLE enrollments
      ALTER COLUMN scopes DROP DEFAULT,
      ALTER COLUMN scopes TYPE text[] USING public.jsonb_array_to_text_array(scopes),
      ALTER COLUMN scopes SET DEFAULT '{}'::text[];
    SQL

    execute <<-SQL
      DROP FUNCTION public.jsonb_array_to_text_array(_js jsonb);
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE enrollments
      ALTER COLUMN scopes DROP DEFAULT,
      ALTER COLUMN scopes TYPE jsonb USING to_jsonb(scopes),
      ALTER COLUMN scopes SET DEFAULT '{}'::jsonb;
    SQL
    Enrollment.all.each do |enrollment|
      enrollment.update_column(:scopes, enrollment[:scopes].map { |scope| [scope, true] }.to_h)
    end
  end
end
