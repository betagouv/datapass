# frozen_string_literal: true

class Enrollment::ApiSfipUniquePolicy < Enrollment::UniquePolicy
  include DgfipPolicyMethods

  def permitted_attributes
    res = super

    res.concat([
      scopes: impot_particulier_permitted_scopes
    ])
    augment_permitted_attributes(res, :additional_content, *impot_particulier_permitted_acces)

    res
  end
end
