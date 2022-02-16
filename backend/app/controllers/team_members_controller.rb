class TeamMembersController < ApplicationController
  before_action :authenticate_user!

  def update
    @team_member = authorize TeamMember.find(params[:id])

    @team_member.update!(permitted_attributes(@team_member))
    @team_member.enrollment.events.create(
      name: "update",
      user_id: current_user.id,
      diff: @team_member.enrollment.previous_changes
    )
    @team_member.enrollment.notify_event(
      "team_member_update",
      team_member_type: @team_member.type
    )

    render json: @team_member
  end

  private

  def pundit_params_for(_record)
    params.fetch(:team_member, {})
  end
end
