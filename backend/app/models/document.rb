class Document < ApplicationRecord
  mount_uploader :attachment, DocumentUploader

  belongs_to :attachable, polymorphic: true, optional: true

  validates_presence_of :type, :attachment
  validate :content_type_validation

  before_save :overwrite
  after_save :touch_enrollment

  default_scope -> { where(archive: false) }

  def file_content
    if attachment.class.storage == CarrierWave::Storage::AWS
      tempfile = Tempfile.new
      tempfile.write(attachment.read)
      tempfile.rewind
      tempfile
    else
      File.open(attachment.file.file, "r")
    end
  end

  private

  def content_type_validation
    raise ::NotImplementedError
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
