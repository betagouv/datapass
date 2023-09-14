class Enrollment::ApiInfinoeUniquePolicy < Enrollment::UniquePolicy
  include DgfipPolicyMethods

  def permitted_attributes
    res = super

    res.concat([
      scopes: infinoe_permitted_scopes
    ])
    augment_permitted_attributes(res, :additional_content, *infinoe_permitted_acces)

    res
  end
end
