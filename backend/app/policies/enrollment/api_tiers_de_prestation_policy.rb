class Enrollment::ApiTiersDePrestationPolicy < EnrollmentPolicy
  def notify?
    false
  end

  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :id_client,
        :id_demande_paiement,
        :demande_paiement,
        :num_facture_tiers,
        :statut,
        :info_rejet,
        :info_virement
      ]
    ])

    res
  end
end
