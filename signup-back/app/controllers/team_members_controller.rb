class TeamMembersController < ApplicationController
  before_action :authenticate_user!

  def update
    @team_member = authorize TeamMember.find(params[:id])

    if @team_member.update(permitted_attributes(@team_member))
      @team_member.enrollment.events.create(
        name: "updated",
        user_id: current_user.id,
        diff: @team_member.enrollment.previous_changes
      )
      @team_member.enrollment.notify_event(
        "team_member_updated",
        team_member_type: @team_member.type
      )

      render json: @team_member
    else
      render json: @team_member.errors, status: :unprocessable_entity
    end
  end

  private

  def pundit_params_for(_record)
    params.fetch(:team_member, {})
  end
end
