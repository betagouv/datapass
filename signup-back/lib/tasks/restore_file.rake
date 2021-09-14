# Task in order to restore uploaded files from backup (Note: you need to restore database first)
# find ./public/uploads/document | grep "\.\w" | xargs -I '{}' bundle exec rake db:restore_file['{}']
desc "restore a file"
task(:restore_file, [:file_path] => :environment) do |_task, args|
  file_path = args[:file_path]
  document_id = file_path.split("/")[2]
  document_class_name = file_path.split("/")[0].classify
  document_class = "Document::#{document_class_name}".constantize
  document_class.find_by(id: document_id)&.update(attachment: File.open(file_path))
end
