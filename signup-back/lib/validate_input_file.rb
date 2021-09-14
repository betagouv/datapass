require "csv"

INPUT_FILE = "./input.csv"
OUTPUT_FILE = "./email_to_validate.txt"

email_to_validate_file = File.open(OUTPUT_FILE, "w")

CSV.foreach(INPUT_FILE, headers: true, strip: true, liberal_parsing: true) do |row|
  sleep 0.75
  # Mind that the usage of API v3 was not tested.
  # There might be unwanted concurrency issues.
  response = HTTP.get("https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/#{row["siret"]}")
  unless response.status.success? && response.parse["etablissement"]["etat_administratif"] == "A"
    puts "\e[31m#{row["siret"]} not found!\e[0m"
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
  puts "#{row["siret"]} - #{nom_raison_sociale}"

  unless [
    "84", # SERVICES D’ADMINISTRATION PUBLIQUE ET DE DÉFENSE ; SERVICES DE SÉCURITÉ SOCIALE OBLIGATOIRE
    "85", # ENSEIGNEMENT
    "86", # ACTIVITÉS POUR LA SANTÉ HUMAINE
    "88" # Action sociale sans hébergement
  ].include? activite_principale[0, 2]
    puts "\e[31m#{row["siret"]} does not appear to be of a public service organization siret!\e[0m"
  end

  email_to_validate_file.puts row["resp_traitement_email"]
end

puts "NB: please validate email list written in #{OUTPUT_FILE}"
puts "Submit the file on https://app.debounce.io/"
puts "Error code documentation can be found here: https://debounce.io/resources/help-desk/understanding-results/result-codes/"
