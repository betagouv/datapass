class StatsController < ApplicationController
  # GET /stats
  def show
    # Before adding new stat query, beware that before migrations of 2019-04-02
    # - there is no 'updated' event nor 'updated_contacts' event
    # - there was a unique constraint that does not allow multiple event of the same type
    #   on the same enrollments. Consequently, some submit and request_changes
    #   events are missing in production database.

    begin
      raw_target_api_list = params.permit(:target_api_list)[:target_api_list]
      target_api_list = JSON.parse(raw_target_api_list)

      target_api_list.any? do |target_api|
        unless DataProvidersConfiguration.instance.exists?(target_api)
          puts "#{DataProvidersConfiguration.instance.exists?(target_api)}"
          raise ActionController::BadRequest, "Invalid target_api"
        end
      end

      if target_api_list.count > 0
        target_api_list.each { |target_api| "target_api_list = ANY.('#{ActiveRecord::Base.connection.quote_string(target_api)}').join(', ')" }
      end
    rescue JSON::ParserError
    end

    do_filter_by_target_api = params.permit(:target_api).key?(:target_api)
    target_api = params.permit(:target_api)[:target_api]
    filter_by_target_api_criteria = do_filter_by_target_api ?
      "target_api = '#{ActiveRecord::Base.connection.quote_string(target_api)}'" :
      "1 = 1" # equivalent to no filter

    # Habilitations déposées
    enrollment_count_query = <<-SQL
      SELECT COUNT(*) FROM enrollments WHERE #{filter_by_target_api_criteria};
    SQL
    enrollment_count = ActiveRecord::Base
      .connection
      .execute(enrollment_count_query)
      .getvalue(0, 0)

    # Habilitations validées
    validated_enrollment_count_query = <<-SQL
      SELECT COUNT(*) FROM enrollments WHERE status = 'validated' AND #{filter_by_target_api_criteria};
    SQL
    validated_enrollment_count = ActiveRecord::Base
      .connection
      .execute(validated_enrollment_count_query)
      .getvalue(0, 0)

    # Temps moyen de traitement des habilitations
    average_processing_time_in_days = GetAverageProcessingTimeInDays.call(target_api)

    # Pourcentage d’habilitations nécessitant un aller retour
    go_back_ratio_query = <<-SQL
      SELECT round((COUNT(go_back_count)*100)::numeric/NULLIF(COUNT(*), 0), 0) as go_back_ratio
      FROM (
        SELECT
          enrollments.id, NULLIF(COUNT(enrollments.id) - 1, 0) as go_back_count
        FROM enrollments
          LEFT JOIN
          events ON events.enrollment_id = enrollments.id
          AND events.name IN ('create', 'request_changes')
        WHERE enrollments.status IN ('validated', 'refused')
        AND #{filter_by_target_api_criteria}
        AND enrollments.updated_at > CURRENT_DATE - INTERVAL '6 months'
        GROUP BY enrollments.id
      ) e;
    SQL
    go_back_ratio = ActiveRecord::Base
      .connection
      .execute(go_back_ratio_query)
      .getvalue(0, 0)
      .to_i

    # Habilitations déposées
    monthly_enrollment_count_query = <<-SQL
      SELECT
        date_trunc('month', created_at) AS month,
        COUNT(*) filter (where status = 'draft') as draft,
        COUNT(*) filter (where status = 'changes_requested') as changes_requested,
        COUNT(*) filter (where status = 'submitted') as submitted,
        COUNT(*) filter (where status = 'validated') as validated,
        COUNT(*) filter (where status = 'refused') as refused,
        COUNT(*) filter (where status = 'revoked') as revoked,
        COUNT(*) as total
      FROM enrollments
      WHERE #{filter_by_target_api_criteria}
      GROUP BY month
      ORDER BY month;
    SQL
    monthly_enrollment_count = ActiveRecord::Base
      .connection
      .exec_query(monthly_enrollment_count_query)
      .to_a

    # Répartition des habilitations par API
    enrollment_by_target_api_query = <<-SQL
      SELECT target_api AS name, COUNT(target_api)
      FROM enrollments
      WHERE #{filter_by_target_api_criteria}
      GROUP BY target_api
      ORDER BY COUNT(target_api) desc;
    SQL
    enrollment_by_target_api = ActiveRecord::Base
      .connection
      .exec_query(enrollment_by_target_api_query)
      .to_a

    # Répartition des habilitations par statut
    enrollment_by_status_query = <<-SQL
      SELECT status AS name, count(status)
      FROM enrollments
      WHERE #{filter_by_target_api_criteria}
      GROUP BY status;
    SQL
    enrollment_by_status = ActiveRecord::Base
      .connection
      .exec_query(enrollment_by_status_query)
      .to_a

    render json: {
      enrollment_count: enrollment_count,
      validated_enrollment_count: validated_enrollment_count,
      average_processing_time_in_days: average_processing_time_in_days,
      go_back_ratio: go_back_ratio,
      monthly_enrollment_count: monthly_enrollment_count,
      enrollment_by_target_api: enrollment_by_target_api,
      enrollment_by_status: enrollment_by_status
    }
  end

  def majority_percentile_processing_time_in_days
    target_api = params.permit(:target_api)[:target_api]

    majority_percentile_processing_time_in_days = GetMajorityPercentileProcessingTimeInDays.call(target_api)

    render json: {
      majority_percentile_processing_time_in_days: majority_percentile_processing_time_in_days
    }
  end
end
