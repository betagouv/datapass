require "csv"

INPUT_FILE = "./export_hubee.csv"
OUTPUT_FILE = "./hubee_prepared_import.csv"
ERROR_OUTPUT_FILE = "./hubee_excluded_import.csv"

hubee_prepared_import_file = CSV.open(OUTPUT_FILE, "w")
hubee_prepared_import_file << %w[siret nom_raison_sociale scope demandeur_email responsable_metier_email]
hubee_excluded_import_file = CSV.open(ERROR_OUTPUT_FILE, "w")
hubee_excluded_import_file << %w[demarche siret rejection_reason]

puts "Import preparation started from #{INPUT_FILE}..."

CSV.foreach(INPUT_FILE, headers: true, liberal_parsing: true) do |row|
  scope = row["Démarche"]
  siret = row["Siret SI"]
  puts "Processing: #{siret} - #{scope}"
  pass_id = row["N° DataPass"]
  demandeur_email = row["Email de notification"]
  responsable_metier_email = row["Administrateur local"]

  # validate inputs
  unless scope.in?(%w[EtatCivil depotDossierPACS recensementCitoyen HebergementTourisme JeChangeDeCoordonnees CERTDC])
    hubee_excluded_import_file << [scope, siret, "Démarche non gérée : #{scope}"]
    puts "\e[31mDémarche non gérée : #{scope}\e[0m"
    next
  end
  unless siret.match?(/^\d{14}$/)
    hubee_excluded_import_file << [scope, siret, "siret - Format invalide : #{siret}"]
    puts "\e[31msiret - Format invalide : #{siret}\e[0m"
    next
  end
  unless !demandeur_email || demandeur_email.match(URI::MailTo::EMAIL_REGEXP)
    hubee_excluded_import_file << [scope, siret, "demandeur_email - Format invalide : #{demandeur_email}"]
    puts "\e[31mdemandeur_email - Format invalide : #{demandeur_email}\e[0m"
    next
  end
  unless !responsable_metier_email || responsable_metier_email.match(URI::MailTo::EMAIL_REGEXP)
    hubee_excluded_import_file << [scope, siret, "responsable_metier_email - Format invalide #{responsable_metier_email}"]
    puts "\e[31mresponsable_metier_email - Format invalide #{responsable_metier_email}\e[0m"
    next
  end

  # exclude non eligible subscriptions
  modalite_acces = row["Modalité d'accès"]
  unless modalite_acces == "PORTAIL"
    hubee_excluded_import_file << [scope, siret, "Modalité d’accès non gérée : #{modalite_acces}"]
    puts "\e[31mModalité d’accès non gérée : #{modalite_acces}\e[0m"
    next
  end
  unless pass_id == "0"
    hubee_excluded_import_file << [scope, siret, "DataPass déjà présent : #{pass_id}"]
    puts "\e[31mDataPass déjà présent : #{pass_id}\e[0m"
    next
  end
  sleep 0.75
  # Mind that the usage of API v3 was not tested.
  # There might be unwanted concurrency issues.
  response = HTTP.get("https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/#{siret}")
  unless response.status.success? && response.parse["etablissement"]["etat_administratif"] == "A"
    hubee_excluded_import_file << [scope, siret, "Organisation inactive"]
    puts "\e[31mOrganisation inactive\e[0m"
    next
  end

  activite_principale = response.parse["etablissement"]["activite_principale"]
  nom_raison_sociale = response.parse["etablissement"]["unite_legale"]["denomination"]
  nom_raison_sociale ||= response.parse["etablissement"]["denomination_usuelle"]
  nom = response.parse["etablissement"]["unite_legale"]["nom"]
  prenom_1 = response.parse["etablissement"]["unite_legale"]["prenom_1"]
  prenom_2 = response.parse["etablissement"]["unite_legale"]["prenom_2"]
  prenom_3 = response.parse["etablissement"]["unite_legale"]["prenom_3"]
  prenom_4 = response.parse["etablissement"]["unite_legale"]["prenom_4"]
  nom_raison_sociale ||= "#{nom + "*" unless nom.nil?}#{prenom_1 unless prenom_1.nil?}#{" " + prenom_2 unless prenom_2.nil?}#{" " + prenom_3 unless prenom_3.nil?}#{" " + prenom_4 unless prenom_4.nil?}"

  unless [
    "84", # SERVICES D’ADMINISTRATION PUBLIQUE ET DE DÉFENSE ; SERVICES DE SÉCURITÉ SOCIALE OBLIGATOIRE
    "85", # ENSEIGNEMENT
    "86", # ACTIVITÉS POUR LA SANTÉ HUMAINE
    "88" # Action sociale sans hébergement
  ].include? activite_principale[0, 2]
    puts "\e[33mL’organisation #{nom_raison_sociale} n’est pas une administration (NAF: #{activite_principale}).\e[0m"
  end

  # data transformation
  if demandeur_email == "contact-nhube@data.gouv.fr" || demandeur_email == "migration@hubee.com"
    demandeur_email = nil
  end
  if responsable_metier_email == "contact-nhube@data.gouv.fr" || responsable_metier_email == "migration@hubee.com"
    responsable_metier_email = nil
  end
  if responsable_metier_email && !demandeur_email
    demandeur_email == responsable_metier_email
  end

  hubee_prepared_import_file << [siret, nom_raison_sociale, scope, demandeur_email, responsable_metier_email]
end

puts "Import preparation completed!"
puts "You can now import #{OUTPUT_FILE} in database"
puts "Errors can be found in #{ERROR_OUTPUT_FILE}"
