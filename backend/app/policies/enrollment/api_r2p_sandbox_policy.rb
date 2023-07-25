class Enrollment::ApiR2pSandboxPolicy < Enrollment::SandboxPolicy
  include DgfipPolicyMethods

  def permitted_attributes
    augment_permitted_attributes(super, :additional_content, *r2p_permitted_acces)
  end
end
