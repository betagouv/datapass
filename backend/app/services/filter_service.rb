class FilterService < ApplicationService
  def initialize(params)
    @filters = JSON.parse(params.fetch(:filter, "[]"))
  end

  def is_valid_key(key)
    %w[id siret nom_raison_sociale target_api status team_members.email only_with_unprocessed_messages].include? key
  end

  def is_fuzzy(key)
    %w[id siret nom_raison_sociale team_members.email].include? key
  end

  def sanitize_value(value)
    filter_value = value.is_a?(Array) ? value : [value]
    sanitized_filter_value = filter_value.map { |f| Regexp.escape(f) }
    sanitized_filter_value.map { |f| ActiveSupport::Inflector.transliterate(f, " ") }.join("|")
  end

  def sanitize_key(key)
    if key.start_with? "team_members."
      key.split(".").map { |e| "\"#{e}\"" }.join(".")
    else
      "\"enrollments\".\"#{key}\""
    end
  end

  def filter_enrollments(key, enrollments)
    if key.start_with? "team_members."
      enrollments = enrollments.includes(:team_members)
    elsif key == "only_with_unprocessed_messages"
      enrollments = enrollments.joins(:events).where({events: {
        name: "notify",
        processed_at: nil,
        is_notify_from_demandeur: true
      }})
    end
    enrollments
  end

  def call(enrollments)
    @filters.each do |filter_item|
      filter_item.each do |filter_key, filter_value|
        next unless is_valid_key(filter_key)

        enrollments = filter_enrollments(filter_key, enrollments)
        sanitized_filter_value = sanitize_value(filter_value)
        next if sanitized_filter_value == ""

        sanitized_filter_key = sanitize_key(filter_key)
        enrollments = enrollments.where(
          "#{sanitized_filter_key}::varchar(255) ~* ?",
          is_fuzzy(filter_key) ? ".*(#{sanitized_filter_value}).*" : "^(#{sanitized_filter_value})$"
        )
      end
    end
    enrollments
  end
end
