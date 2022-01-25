class PublicEnrollmentListSerializer < ActiveModel::Serializer
  attributes :target_api, :siret, :nom_raison_sociale, :updated_at, :intitule

  attribute :responsable_traitement_family_name do
    object.responsable_traitement.try(:family_name)
  end

  attribute :responsable_traitement_given_name do
    object.responsable_traitement.try(:given_name)
  end
end
