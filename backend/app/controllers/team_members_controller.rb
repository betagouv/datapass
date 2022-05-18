class TeamMembersController < ApplicationController
  before_action :authenticate_user!

  def update
    @team_member = authorize TeamMember.find(params[:id])

    params = {
      team_members_attributes: [
        {
          id: @team_member.id,
          **permitted_attributes(@team_member)
        }
      ]
    }

    @team_member.enrollment.update!(params)
    @team_member.enrollment.events.create(
      name: "update",
      user_id: current_user.id,
      diff: @team_member.enrollment.diff_with_associations
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
