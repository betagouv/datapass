class Enrollment::ApiImpotParticulierUniquePolicy < Enrollment::UniquePolicy
  include DgfipPolicyMethods

  def permitted_attributes
    res = super

    res.concat([
      scopes: impot_particulier_permitted_scopes
    ])
    augment_permitted_attributes(res, :additional_content, *impot_particulier_permitted_acces, *impot_particulier_specific_requirements)

    res
  end
end
