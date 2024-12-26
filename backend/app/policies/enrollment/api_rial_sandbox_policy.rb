class Enrollment::ApiRialSandboxPolicy < Enrollment::SandboxPolicy
  include DgfipPolicyMethods

  def permitted_attributes
    res = super

    augment_permitted_attributes(res, :additional_content, *rial_permitted_acces)
    res
  end
end
