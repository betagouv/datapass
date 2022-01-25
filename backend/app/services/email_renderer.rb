# frozen_string_literal: true

require "erb"

class EmailRenderer
  class LocalBinding
    def initialize(hash)
      hash.each do |key, value|
        instance_variable_set("@#{key}", value)
      end
    end

    def get_binding
      binding
    end
  end

  def initialize(file, variables)
    @file = file
    @variables = variables
  end

  def perform
    ERB.new(file_content).result(LocalBinding.new(@variables).get_binding)
  end

  private

  def file_content
    File.read(file_path)
  end

  def file_path
    Rails.root.join("app/views", "#{@file}.text.erb")
  end
end
