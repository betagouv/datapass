class InseeController < ApplicationController
  # GET /insee/ping
  def ping
    ApiSirene.new("13002526500013").etablissement # we use DINUM siret for the ping route

    render status: :ok, json: {}
  end

  # GET /insee/etablissements/1
  def etablissements
    data = ApiSirene.call(params.fetch(:siret))

    if data.nil?
      return render status: :not_found, json: {etablissement: nil}
    end

    render status: :ok, json: {
      etablissement: data
    }
  end

  # GET /insee/codes_naf/1
  def codes_naf
    process_code_action(:code_naf, params.fetch(:id).delete("."))
  end

  # GET /insee/categories_juridiques/1
  def categories_juridiques
    process_code_action(:categorie_juridique, params.fetch(:id))
  end

  private

  def process_code_action(kind, code)
    data_path = Rails.root.join(relative_path_data_file_for_kind(kind))
    data = JSON.parse(File.read(data_path))

    if data[code].nil?
      render status: :not_found, json: {}
    else
      render status: :ok, json: {
        message: data[code]
      }
    end
  end

  def relative_path_data_file_for_kind(kind)
    case kind
    when :code_naf
      "./public/codes_naf.json"
    when :categorie_juridique
      "./public/categories_juridiques_20200701.json"
    # :nocov:
    else
      raise NotImplementError, "'#{kind}' does not exist"
    end
    # :nocov:
  end
end
