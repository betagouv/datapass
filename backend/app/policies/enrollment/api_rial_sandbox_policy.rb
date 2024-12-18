class Enrollment::ApiRialSandboxPolicy < Enrollment::SandboxPolicy
  include DgfipPolicyMethods

  def permitted_attributes
    super.tap do |res|
      augment_permitted_attributes(res, :additional_content, *api_rial_specific_requirements)
    end
  end
end
