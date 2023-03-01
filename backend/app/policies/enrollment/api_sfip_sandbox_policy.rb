# frozen_string_literal: true

class Enrollment::ApiSfipSandboxPolicy < Enrollment::SandboxPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
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
        :dgfip_IndLep,
        :dgfip_annee_n_moins_1,
        :dgfip_annee_n_moins_2,
        :dgfip_annee_n_moins_3,
        :dgfip_annee_n_moins_2_si_indispo_n_moins_1
      ],
      additional_content: [
        :rgpd_general_agreement,
        :acces_spi,
        :acces_etat_civil
      ]
    ])

    res
  end
end
