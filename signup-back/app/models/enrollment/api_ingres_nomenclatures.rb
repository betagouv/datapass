class Enrollment::ApiIngresNomenclatures < Enrollment
  protected

  def submit_validation
    super

    scopes_validation
    responsable_technique_validation
  end
end
