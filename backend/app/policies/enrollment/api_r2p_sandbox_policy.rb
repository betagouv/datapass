class Enrollment::ApiR2pSandboxPolicy < Enrollment::SandboxPolicy
  include DgfipPolicyMethods

  def permitted_attributes
    res = super

    res.concat([
      additional_content: super_additional_content(res) + r2p_permitted_acces
    ])

    res
  end
end
