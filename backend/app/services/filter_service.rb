class FilterService < ApplicationService
  def initialize(params, items)
    @filters = JSON.parse(params.fetch(:filter, "[]"))
    @items = items
  end

  def is_valid_key(key, table_name)
    case table_name
    when "users"
      %w[email].include? key
    when "enrollments"
      %w[id siret nom_raison_sociale target_api status zip_code team_members.email only_with_unprocessed_messages].include? key
    else
      raise "'#{table_name}' is not supported by FilterService"
    end
  end

  def is_fuzzy(key, table_name)
    case table_name
    when "users"
      %w[email].include? key
    when "enrollments"
      %w[id siret nom_raison_sociale zip_code team_members.email].include? key
    else
      raise "'#{table_name}' is not supported by FilterService"
    end
  end

  def sanitize_value(value)
    filter_value = value.is_a?(Array) ? value : [value]
    sanitized_filter_value = filter_value.map { |f| Regexp.escape(f.to_s) }
    sanitized_filter_value.map { |f| ActiveSupport::Inflector.transliterate(f, " ") }.join("|")
  end

  def sanitize_key(key, table_name)
    if key.start_with? "team_members."
      key.split(".").map { |e| "\"#{e}\"" }.join(".")
    else
      "\"#{table_name}\".\"#{key}\""
    end
  end

  def call
    @filters.each do |filter_item|
      next unless is_valid_key(filter_item["key"], @items.table_name)

      # When working with enrollments, we may want to augment the data for further filtering
      if @items.table_name == "enrollments"
        if filter_item["key"].start_with? "team_members."
          @items = @items.includes(:team_members)
        elsif filter_item["key"] == "only_with_unprocessed_messages"
          @items = @items.joins(:events).where({events: {
            name: "notify",
            processed_at: nil,
            is_notify_from_demandeur: true
          }})
          next
        end
      end

      sanitized_filter_value = sanitize_value(filter_item["value"])
      next if sanitized_filter_value == ""

      sanitized_filter_key = sanitize_key(filter_item["key"], @items.table_name)
      @items = @items.where(
        "#{sanitized_filter_key}::varchar(255) ~* ?",
        is_fuzzy(filter_item["key"], @items.table_name) ? ".*(#{sanitized_filter_value}).*" : "^(#{sanitized_filter_value})$"
      )
    end
    @items
  end
end
