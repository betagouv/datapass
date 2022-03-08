# frozen_string_literal: true

class Document < ActiveRecord::Base
  mount_uploader :attachment, PdfUploader

  belongs_to :attachable, polymorphic: true, optional: true

  validates_presence_of :type, :attachment
  validate :content_type_validation

  before_save :overwrite
  after_save :touch_enrollment

  default_scope -> { where(archive: false) }

  private

  def content_type_validation
    if attachment&.file && !MagicPdfValidator.new(File.new(attachment.file.file, "r")).valid?
      errors.add("documents.attachment", :invalid, "Format de fichier invalide. Merci de joindre uniquement des documents au format pdf.")
    end
  rescue RuntimeError
    errors.add("documents.attachment", :invalid, "Format de fichier invalide. Merci de joindre uniquement des documents au format pdf.")
  end

  def touch_enrollment
    attachable.touch
  end

  def overwrite
    attachable
      .documents
      .where(type: type)
      .update_all(archive: true)
  end
end
