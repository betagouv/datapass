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
      %w[id siret nom_raison_sociale intitule target_api status zip_code team_members.email only_with_unprocessed_messages].include? key
    else
      raise "'#{table_name}' is not supported by FilterService"
    end
  end

  def is_fuzzy(key, table_name)
    case table_name
    when "users"
      %w[email].include? key
    when "enrollments"
      %w[id siret nom_raison_sociale intitule zip_code team_members.email].include? key
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

  def global_search_query(value)
    query_parts = []

    case @items.table_name
    when "users"
      query_parts << "email"
    when "enrollments"
      query_parts += %w[id siret nom_raison_sociale intitule target_api status zip_code team_members.email]
    else
      raise "'#{@items.table_name}' is not supported by FilterService"
    end

    sanitized_value = sanitize_value(value)
    query = query_parts.map do |key|
      sanitized_key = if key == "team_members.email"
        "(SELECT string_agg(email, ' ') FROM team_members WHERE team_members.enrollment_id = enrollments.id)"
      else
        sanitize_key(key, @items.table_name)
      end

      "#{sanitized_key}::varchar(255) ~* '.*(#{sanitized_value}).*' OR levenshtein(lower(#{sanitized_key}::varchar(255)), '#{sanitized_value.downcase}') <= 3"
    end

    query.join(" OR ")
  end

  def call
    global_search = @filters.find { |filter_item| filter_item["key"] == "global_search" }
    if global_search
      @items = @items.where(global_search_query(global_search["value"]))
      @filters.reject! { |filter_item| filter_item["key"] == "global_search" }
    end

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
