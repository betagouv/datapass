class Enrollment::ApiRialSandboxPolicy < Enrollment::SandboxPolicy
  include DgfipPolicyMethods

  def permitted_attributes
    augment_permitted_attributes(super, :additional_content)
  end
end
