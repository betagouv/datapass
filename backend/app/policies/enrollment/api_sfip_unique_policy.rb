# frozen_string_literal: true

class Enrollment::ApiSfipUniquePolicy < Enrollment::UniquePolicy
  include DgfipPolicyMethods

  def permitted_attributes
    res = super

    res.concat([
      scopes: impot_particulier_permitted_scopes,
      additional_content:
        super_additional_content(res) + impot_particulier_permitted_acces
    ])

    res
  end
end
