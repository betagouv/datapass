class FilterService < ApplicationService
  def initialize(params)
    @filters = JSON.parse(params.fetch(:filter, "[]"))
  end

  def call(enrollments)
    @filters.each do |filter_item|
      filter_item.each do |filter_key, filter_value|
        next unless %w[id siret nom_raison_sociale target_api status team_members.email only_with_unprocessed_messages].include? filter_key
        if filter_key == "only_with_unprocessed_messages"
          enrollments = enrollments.joins(:events).where({events: {
            name: "notify",
            processed_at: nil,
            is_notify_from_demandeur: true
          }})
          next
        end
        is_fuzzy = %w[id siret nom_raison_sociale team_members.email].include? filter_key
        filter_value = [filter_value] unless filter_value.is_a?(Array)
        sanitized_filter_value = filter_value.map { |f| Regexp.escape(f) }
        san_fil_val_without_accent = sanitized_filter_value.map { |f| ActiveSupport::Inflector.transliterate(f, " ") }.join("|")
        next if san_fil_val_without_accent == ""

        if filter_key.start_with? "team_members."
          enrollments = enrollments.includes(:team_members)
          sanitized_filter_key = filter_key.split(".").map { |e| "\"#{e}\"" }.join(".")
        else
          sanitized_filter_key = "\"enrollments\".\"#{filter_key}\""
        end

        enrollments = enrollments.where(
          "#{sanitized_filter_key}::varchar(255) ~* ?",
          is_fuzzy ? ".*(#{san_fil_val_without_accent}).*" : "^(#{san_fil_val_without_accent})$"
        )
      end
    end
    enrollments
  end
end
