require "csv"

INPUT_FILE = "./export_hubee.csv"
OUTPUT_FILE = "./hubee_prepared_import.csv"
ERROR_OUTPUT_FILE = "./hubee_excluded_import.csv"

hubee_prepared_import_file = CSV.open(OUTPUT_FILE, "w")
hubee_prepared_import_file << %w[siret nom_raison_sociale scope demandeur_email responsable_metier_email]
hubee_excluded_import_file = CSV.open(ERROR_OUTPUT_FILE, "w")
hubee_excluded_import_file << ["Démarche", "Siret SI", "Branch Code SI", "N° DataPass", "Modalité d'accès", "DT", "Statut", "Date d'activation", "Date de suspension", "Date de validation", "Date de mise à jour", "Date de refus", "Motif du refus", "Fréquence de notification", "Email de notification", "Administrateur local", "Délégué technique", "rejection_reason"]
def to_csv_line(row, rejection_reason)
  [row["Démarche"], row["Siret SI"], row["Branch Code SI"], row["N° DataPass"], row["Modalité d'accès"], row["DT"], row["Statut"], row["Date d'activation"], row["Date de suspension"], row["Date de validation"], row["Date de mise à jour"], row["Date de refus"], row["Motif du refus"], row["Fréquence de notification"], row["Email de notification"], row["Administrateur local"], row["Délégué technique"], rejection_reason]
end

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
    rejection_reason = "Démarche non gérée : #{scope}"
    hubee_excluded_import_file << to_csv_line(row, rejection_reason)
    puts "\e[31m#{rejection_reason}\e[0m"
    next
  end
  unless siret.match?(/^\d{14}$/)
    rejection_reason = "siret - Format invalide : #{siret}"
    hubee_excluded_import_file << to_csv_line(row, rejection_reason)
    puts "\e[31m#{rejection_reason}\e[0m"
    next
  end
  unless !demandeur_email || demandeur_email.match(URI::MailTo::EMAIL_REGEXP)
    rejection_reason = "demandeur_email - Format invalide : #{demandeur_email}"
    hubee_excluded_import_file << to_csv_line(row, rejection_reason)
    puts "\e[31m#{rejection_reason}\e[0m"
    next
  end
  unless !responsable_metier_email || responsable_metier_email.match(URI::MailTo::EMAIL_REGEXP)
    rejection_reason = "responsable_metier_email - Format invalide #{responsable_metier_email}"
    hubee_excluded_import_file << to_csv_line(row, rejection_reason)
    puts "\e[31m#{rejection_reason}\e[0m"
    next
  end

  # exclude non eligible subscriptions
  unless pass_id == "0"
    rejection_reason = "DataPass déjà présent : #{pass_id}"
    hubee_excluded_import_file << to_csv_line(row, rejection_reason)
    puts "\e[31m#{rejection_reason}\e[0m"
    next
  end
  sleep 0.75
  # Mind that the usage of ApiSirene service has not been tested.
  response = ApiSirene.call(enrollment.siret)
  if response.nil? || response[:etat_administratif] != "A"
    rejection_reason = "Organisation inactive"
    hubee_excluded_import_file << to_csv_line(row, rejection_reason)
    puts "\e[31m#{rejection_reason}\e[0m"
    next
  end

  activite_principale = response[:activite_principale]
  nom_raison_sociale = response[:nom_raison_sociale]

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
