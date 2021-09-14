class DocumentSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :attachment

  attribute :type do
    object.type
  end

  attribute :filename do
    object.attachment.file.filename
  end
end
