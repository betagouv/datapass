class Enrollment::ApiFicobaSandboxPolicy < Enrollment::SandboxPolicy
  include DgfipPolicyMethods

  def permitted_attributes
    res = super

    res[:scopes] = ficoba_permitted_scopes
    augment_permitted_attributes(res, :additional_content, *ficoba_permitted_acces)
  end
end
