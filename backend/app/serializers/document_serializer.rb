class DocumentSerializer < ApplicationSerializer
  attributes :id, :created_at, :updated_at

  attribute :type do
    object.type
  end

  attribute :filename do
    object.attachment.file.filename
  end

  attribute :attachment do
    {
      url: document_path(object),
    }
  end
end
