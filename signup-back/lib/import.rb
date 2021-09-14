require "csv"
require "./config/environment"

INPUT_FILE = "./input.csv"
OUTPUT_FILE = "./output.csv"
TARGET_API = "franceconnect"
USER_EMAIL = "test300401@yopmail.com"
VALIDATOR_EMAIL = "franceconnect@yopmail.com"

output_file = CSV.open(OUTPUT_FILE, "w")
output_file << %w[intitule description scopes texte_juridique url_texte_juridique destinataires_donnees duree_conservation_donnee dpd_nom dpd_prenom dpd_email dpd_telephone resp_technique_email resp_technique_telephone resp_traitement_nom resp_traitement_prenom resp_traitement_email resp_traitement_telephone siret site_url redirect_uris post_logout_uris ips logo signup_id client_id client_secret]

puts "Importing data from #{INPUT_FILE}"

CSV.foreach(INPUT_FILE, headers: true, strip: true, liberal_parsing: true) do |row|
  intitule = row["intitule"]
  description = row["description"]
  scopes = row["scopes"]
  texte_juridique = row["texte_juridique"]
  url_texte_juridique = row["url_texte_juridique"]
  destinataires_donnees = row["destinataires_donnees"]
  duree_conservation_donnee = row["duree_conservation_donnee"]
  dpd_nom = row["dpd_nom"]
  dpd_prenom = row["dpd_prenom"]
  dpd_email = row["dpd_email"]
  dpd_telephone = row["dpd_telephone"]
  resp_technique_email = row["resp_technique_email"]
  resp_technique_telephone = row["resp_technique_telephone"]
  resp_traitement_nom = row["resp_traitement_nom"]
  resp_traitement_prenom = row["resp_traitement_prenom"]
  resp_traitement_email = row["resp_traitement_email"]
  resp_traitement_telephone = row["resp_traitement_telephone"]
  siret = row["siret"].to_s
  site_url = row["site_url"]
  redirect_uris = row["redirect_uris"]
  post_logout_uris = row["post_logout_uris"]
  ips = row["ips"]
  logo = row["logo"]
  client_id = row["client_id"]
  client_secret = row["client_secret"]
  organization_id = row["organization_id"].to_i

  enrollment_class = "Enrollment::#{TARGET_API.underscore.classify}".constantize
  enrollment = enrollment_class.new

  enrollment.assign_attributes(
    scopes: scopes.split(",").map { |v| [v, true] }.to_h,
    contacts: [{id: "technique", email: resp_technique_email, phone_number: "0#{resp_technique_telephone}"}],
    siret: siret,
    status: "validated",
    cgu_approved: true,
    target_api: TARGET_API,
    # nom_raison_sociale: nom_raison_sociale,
    additional_content: {has_alternative_authentication_methods: true},
    intitule: intitule,
    description: description,
    fondement_juridique_title: texte_juridique,
    fondement_juridique_url: url_texte_juridique,
    data_retention_period: duree_conservation_donnee,
    data_recipients: destinataires_donnees,
    organization_id: organization_id,
    dpo_label: "#{dpd_nom} #{dpd_prenom}",
    dpo_phone_number: "0#{dpd_telephone}",
    responsable_traitement_label: "#{resp_traitement_nom} #{resp_traitement_prenom}",
    responsable_traitement_phone_number: "0#{resp_traitement_telephone}"
  )
  user = User.find_by_email(USER_EMAIL)
  selected_organization = user.organizations.find { |o| o["id"] == organization_id }
  if selected_organization.nil?
    puts "Add #{USER_EMAIL} to organization #{siret}..."
    user.organizations.push({id: organization_id, siret: siret})
    user.save!
  end
  enrollment.user = user
  enrollment.dpo = User.find_or_create_by(email: dpd_email)
  enrollment.responsable_traitement = User.find_or_create_by(email: resp_traitement_email)

  puts "Saving authorization request for #{siret}..."
  enrollment.save!
  enrollment.events.create!(name: "imported", user: User.find_by_email(USER_EMAIL))
  enrollment.events.create!(name: "validated", user: User.find_by_email(VALIDATOR_EMAIL))

  puts "Sending rgpd mail to #{resp_traitement_email}..."
  RgpdMailer.with(
    to: resp_traitement_email,
    target_api: TARGET_API,
    enrollment_id: enrollment.id,
    rgpd_role: EnrollmentsController::RESPONSABLE_TRAITEMENT_LABEL,
    owner_email: USER_EMAIL,
    nom_raison_sociale: enrollment.nom_raison_sociale,
    intitule: enrollment.intitule
  ).rgpd_contact_email.deliver_now

  output_file << [
    intitule, # intitule
    description, # description
    scopes, # scopes
    texte_juridique, # texte_juridique
    url_texte_juridique, # url_texte_juridique
    destinataires_donnees, # destinataires_donnees
    duree_conservation_donnee, # duree_conservation_donnee
    dpd_nom, # dpd_nom
    dpd_prenom, # dpd_prenom
    dpd_email, # dpd_email
    dpd_telephone, # dpd_telephone
    resp_technique_email, # resp_technique_email
    resp_technique_telephone, # resp_technique_telephone
    resp_traitement_nom, # resp_traitement_nom
    resp_traitement_prenom, # resp_traitement_prenom
    resp_traitement_email, # resp_traitement_email
    resp_traitement_telephone, # resp_traitement_telephone
    siret, # siret
    site_url, # site_url
    redirect_uris, # redirect_uris
    post_logout_uris, # post_logout_uris
    ips, # ips
    logo, # logo
    enrollment.id, # signup_id
    client_id, # client_id
    client_secret # client_secret
  ]
end

puts "Import done! Signup_id were added in #{OUTPUT_FILE}."
