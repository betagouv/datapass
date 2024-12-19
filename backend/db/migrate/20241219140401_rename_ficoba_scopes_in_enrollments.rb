class RenameFicobaScopesInEnrollments < ActiveRecord::Migration[7.0]
  def up
    valid_enrollments.find_each do |enrollment|
      scopes = enrollment.scopes.map do |scope|
        case scope
        when "dgfip_ficoba_etat_civil_denomination", "dgfip_ficoba_adresse"
          "dgfip_ficoba_etat_civil_adresse"
        when "dgfip_ficoba_compte"
          "dgfip_ficoba_numero_compte"
        when "dgfip_ficoba_etablissement_bancaire"
          "dgfip_ficoba_etablissement"
        when "dgfip_ficoba_date"
          "dgfip_ficoba_date_ouverture"
        else
          scope
        end
      end

      begin
        enrollment.update!(scopes: scopes.flatten.compact.uniq)
      rescue ActiveRecord::RecordInvalid
        print "Enrollment #{enrollment.id} could not be mis à jour : #{enrollment.errors.full_messages}\n"
      end
    end
  end

  def down
    valid_enrollments.find_each do |enrollment|
      scopes = enrollment.scopes.flat_map do |scope|
        case scope
        when "dgfip_ficoba_etat_civil_adresse"
          ["dgfip_ficoba_etat_civil_denomination", "dgfip_ficoba_adresse"]
        when "dgfip_ficoba_numero_compte"
          ["dgfip_ficoba_compte"]
        when "dgfip_ficoba_etablissement"
          ["dgfip_ficoba_etablissement_bancaire"]
        when "dgfip_ficoba_date_ouverture"
          ["dgfip_ficoba_date"]
        else
          scope
        end
      end

      begin
        enrollment.update!(scopes: scopes.flatten.compact.uniq)
      rescue ActiveRecord::RecordInvalid
        print "Enrollment #{enrollment.id} could not be mis à jour : #{enrollment.errors.full_messages}\n"
      end
    end
  end

  private

  def valid_enrollments
    Enrollment.where(target_api: "api_ficoba_sandbox").where("scopes is not null")
  end
end
