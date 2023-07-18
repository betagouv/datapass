class Enrollment::ApiR2pUniquePolicy < Enrollment::UniquePolicy
  include DgfipPolicyMethods

  def permitted_attributes
    augment_permitted_attributes(super, :additional_content, *r2p_permitted_acces)
  end
end
