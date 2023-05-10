class Enrollment::ApiFicobaSandboxPolicy < Enrollment::SandboxPolicy
  include DgfipPolicyMethods

  def permitted_attributes
    res = super

    res.concat([
      scopes: ficoba_permitted_scopes,
      additional_content: super_additional_content(res) + ficoba_permitted_acces
    ])

    res
  end
end
