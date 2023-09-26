# frozen_string_literal: true

module DgfipPolicyMethods
  protected

  def ficoba_permitted_scopes
    [
      :dgfip_ficoba_etat_civil_denomination,
      :dgfip_ficoba_adresse,
      :dgfip_ficoba_compte,
      :dgfip_ficoba_etablissement_bancaire,
      :dgfip_ficoba_date
    ]
  end

  def ficoba_permitted_acces
    [
      :acces_ficoba_iban,
      :acces_ficoba_spi,
      :acces_ficoba_siren,
      :acces_ficoba_personne_physique,
      :acces_ficoba_personne_morale
    ]
  end

  def r2p_permitted_acces
    [
      :acces_etat_civil_restitution_spi,
      :acces_spi,
      :acces_etat_civil_et_adresse,
      :acces_etat_civil
    ]
  end

  def impot_particulier_fc_permitted_scopes
    [
      :dgfip_nmUsaDec1,
      :dgfip_nmNaiDec1,
      :dgfip_prnmDec1,
      :dgfip_dateNaisDec1,
      :dgfip_nmUsaDec2,
      :dgfip_nmNaiDec2,
      :dgfip_prnmDec2,
      :dgfip_dateNaisDec2,
      :dgfip_aft,
      :dgfip_sitfam,
      :dgfip_nbpart,
      :dgfip_pac_nbPac,
      :dgfip_pac,
      :dgfip_pariso,
      :dgfip_annee_df_au_3112_si_deces_ctb_mp,
      :dgfip_rfr,
      :dgfip_mntRevbareme,
      :dgfip_inddeficit,
      :dgfip_indiIFI,
      :dgfip_RevDecl_Cat1_Tspr,
      :dgfip_RevDecl_Cat1_RentOn,
      :dgfip_RevDecl_Cat2_Rcm,
      :dgfip_RevDecl_Cat3_PMV,
      :dgfip_RevDecl_Cat4_Ref,
      :dgfip_RevDecl_Cat5_NonSal,
      :dgfip_RevNets_Cat1_Tspr,
      :dgfip_RevNets_Cat1_RentOn,
      :dgfip_RevNets_Cat2_Rcm,
      :dgfip_RevNets_Cat3_PMV,
      :dgfip_RevNets_Cat4_Ref,
      :dgfip_RevNets_Cat5_NonSal,
      :dgfip_PaDeduc_EnfMaj,
      :dgfip_PaDeduc_Autres,
      :dgfip_EpargRetrDeduc,
      :dgfip_annee_n_moins_1,
      :dgfip_annee_n_moins_2,
      :dgfip_annee_n_moins_3,
      :dgfip_annee_n_moins_2_si_indispo_n_moins_1
    ]
  end

  def impot_particulier_permitted_scopes
    impot_particulier_fc_permitted_scopes + [
      :dgfip_IndLep
    ]
  end

  def impot_particulier_permitted_acces
    [
      :acces_spi,
      :acces_etat_civil
    ]
  end

  def impot_particulier_specific_need_expression
    [
      :specific_need_expression
    ]
  end
end
