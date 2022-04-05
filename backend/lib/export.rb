require "csv"
require "./config/environment"

OUTPUT_FILE = "./output.csv"

output_file = CSV.open(OUTPUT_FILE, "w")
output_file << %w[id target_api status siret categorie_juridique categorie_juridique_label activite_principale activite_principale_label nom_raison_sociale fondement_juridique_title fondement_juridique_url intitule description instruction_comment]

puts "Exporting enrollments..."

Enrollment.where(status: %w[validated refused]).find_each do |enrollment|
  sleep 0.75
  puts "#{enrollment.id} - #{enrollment.nom_raison_sociale} - #{enrollment.target_api} - #{enrollment.status}"
  response = ApiSirene.call(enrollment.siret)
  if !enrollment.siret || enrollment.siret == "" || response.nil? || response[:etat_administratif] != "A"
    puts "\e[31m#{enrollment.siret} not found!\e[0m"
  else
    activite_principale = response[:activite_principale]
    activite_principale_label = response[:activite_principale_label]
    categorie_juridique = response[:categorie_juridique]
    categorie_juridique_label = response[:categorie_juridique_label]
  end
  if enrollment.events.where(name: %w[validated refused]).order("created_at").last
    instruction_comment = enrollment.events.where(name: %w[validated refused]).order("created_at").last["comment"]
  else
    puts "\e[31mno instruction event found!\e[0m"
  end

  output_file << [
    enrollment.id, # id
    enrollment.target_api, # target_api
    enrollment.status, # status
    enrollment.siret, # siret
    categorie_juridique, # categorie_juridique
    categorie_juridique_label, # categorie_juridique_label
    activite_principale, # activite_principale
    activite_principale_label, # activite_principale_label
    enrollment.nom_raison_sociale, # nom_raison_sociale
    enrollment.fondement_juridique_title, # fondement_juridique_title
    enrollment.fondement_juridique_url, # fondement_juridique_url
    enrollment.intitule, # intitule
    enrollment.description, # description
    instruction_comment # instruction_comment
  ]
end

puts "Export done! Get the output export at #{OUTPUT_FILE}."
