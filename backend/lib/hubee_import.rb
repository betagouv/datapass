require "csv"
require "./config/environment"

INPUT_FILE = "./FINAL_hubee_prepared_import.csv"
IMPORT_ERRORS_FILE = "./FINAL_hubee_import_errors.csv"
IMPORT_WARNING_FILE = "./FINAL_hubee_import_warnings.csv"

import_errors_file = CSV.open(IMPORT_ERRORS_FILE, "w")
import_errors_file << %w[siret nom_raison_sociale scope demandeur_email responsable_metier_email rejection_reason]
import_warnings_file = CSV.open(IMPORT_WARNING_FILE, "w")
import_warnings_file << %w[siret nom_raison_sociale scope demandeur_email responsable_metier_email warning]

puts "Importing data from #{INPUT_FILE}..."

CSV.foreach(INPUT_FILE, headers: true, liberal_parsing: true) do |row|
  siret = row["siret"].to_s
  nom_raison_sociale = row["nom_raison_sociale"]
  scope = row["scope"]
  puts "Processing: #{nom_raison_sociale} - #{scope}"
  demandeur_email = row["demandeur_email"]
  responsable_metier_email = row["responsable_metier_email"]

  email_blacklist = %w[migration@hubee.fr contact@hubee.numerique.gouv.fr sebastien.assali@cgi.com]
  if demandeur_email.in? email_blacklist
    demandeur_email = nil
  end
  if responsable_metier_email.in? email_blacklist
    responsable_metier_email = nil
  end

  existing_enrollments = Enrollment
    .where(siret: siret)
    .where(target_api: scope == "CERTDC" ? "hubee_portail" : "hubee_portail_dila")
    .where(status: "validated")

  rejection_reason = nil
  if existing_enrollments.count > 1
    ids = existing_enrollments.pluck(:id).to_s
    rejection_reason = "Plusieurs habilitations ont déjà été déposées pour cette démarche : #{ids}"
  elsif existing_enrollments.count == 1 &&
      (scope == "CERTDC" || existing_enrollments.first.scopes.any? { |k, v| v && k == scope })
    existing_enrollment_id = existing_enrollments.pluck(:id).to_s
    rejection_reason = "Une habilitation a déjà été déposée pour cette démarche : #{existing_enrollment_id}"
  elsif existing_enrollments.count == 1
    enrollment = existing_enrollments.first
    scopes = enrollment.scopes
    scopes[scope] = true
    enrollment.update_attribute("scopes", scopes)

    saved_demandeur_email = enrollment.team_members.where(type: "demandeur").pluck(:email).first
    if saved_demandeur_email.nil?
      enrollment.team_members.where(type: "demandeur").first.update(email: demandeur_email)
    elsif !demandeur_email.nil? && demandeur_email != saved_demandeur_email
      warning = "L’adresse email du demandeur #{demandeur_email} ne correspond pas à la valeur enregistrée en base : #{saved_demandeur_email}."
      import_warnings_file << [siret, nom_raison_sociale, scope, demandeur_email, responsable_metier_email, warning]
      puts "\e[33m#{warning}\e[0m"
    end
    saved_responsable_metier_email = enrollment.team_members.where(type: "responsable_metier").pluck(:email).first
    if saved_responsable_metier_email.nil?
      enrollment.team_members.where(type: "responsable_metier").first.update(email: responsable_metier_email)
    elsif !responsable_metier_email.nil? && responsable_metier_email != saved_responsable_metier_email
      warning = "L’adresse email du responsable_metier #{responsable_metier_email} ne correspond pas à la valeur enregistrée en base : #{saved_responsable_metier_email}."
      import_warnings_file << [siret, nom_raison_sociale, scope, demandeur_email, responsable_metier_email, warning]
      puts "\e[33m#{warning}\e[0m"
    end
    next
  end

  if rejection_reason
    import_errors_file << [
      siret,
      nom_raison_sociale,
      scope,
      demandeur_email,
      responsable_metier_email,
      rejection_reason
    ]
    puts "\e[31m#{rejection_reason}\e[0m"
    next
  end

  enrollment = if scope == "CERTDC"
    Enrollment::HubeePortail.new
  else
    Enrollment::HubeePortailDila.new
  end

  enrollment.assign_attributes(
    intitule: "Abonnement au portail HubEE",
    scopes: [scope].map { |v| [v, true] }.to_h,
    siret: siret,
    nom_raison_sociale: nom_raison_sociale,
    status: "validated",
    cgu_approved: true,
    dpo_is_informed: true
  )

  enrollment.save(validate: false)
  enrollment.events.create!(name: "import", user: User.find_by_email(scope == "CERTDC" ? "dgs-certdc@sante.gouv.fr" : "support-demarches-sp@dila.gouv.fr"))
  enrollment.team_members.create!(type: "demandeur", email: demandeur_email)
  enrollment.team_members.create!(type: "responsable_metier", email: responsable_metier_email)
end

puts "Import completed!"
puts "Errors can be found in #{IMPORT_ERRORS_FILE}"
puts "Warnings can be found in #{IMPORT_WARNING_FILE}"
