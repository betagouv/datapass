class EventsController < ApplicationController
  before_action :authenticate_user!

  # GET /events/most-used-comments
  def most_used_comments
    event = params.fetch(:event, "")
    target_api = params.fetch(:target_api, "")
    unless Enrollment.state_machine.events.map(&:name).include?(event.to_sym)
      return render status: :bad_request, json: {
        message: ["event not permitted"]
      }
    end
    unless DataProvidersConfiguration.instance.exists?(target_api)
      return render status: :bad_request, json: {
        message: ["target_api not permitted"]
      }
    end

    return render status: :forbidden, json: {} unless current_user.is_instructor?(target_api)

    comments_query = <<-SQL
      SELECT comment
      FROM events INNER JOIN enrollments ON enrollments.id = enrollment_id
      WHERE name = $1 AND enrollments.target_api = $2 AND comment <> ''
      GROUP BY comment
      HAVING COUNT(*) > 1
      ORDER BY count(*) DESC
      LIMIT 10;
    SQL
    comments = ActiveRecord::Base
      .connection
      .exec_query(comments_query, nil, [event, target_api])
      .to_a

    render json: comments
  end
end
