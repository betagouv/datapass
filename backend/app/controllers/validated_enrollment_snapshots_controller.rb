class ValidatedEnrollmentSnapshotsController < AuthenticatedUserController
  def show
    enrollment = Enrollment.find(params[:enrollment_id])

    authorize enrollment

    reified_models = enrollment.snapshots.find(params[:id]).fetch_reified_items

    render json: serialized_data(reified_models),
      status: :ok
  end

  def serialized_data(reified_models)
    ActiveModelSerializers::SerializableResource.new(
      reified_models[0],
      scope: current_user,
      scope_name: :current_user
    ).serializable_hash
      .merge(
        team_members: reified_models[1]['team_members'].map do |team_member|
          TeamMemberSerializer.new(team_member).serializable_hash
        end
      )
  end
end
