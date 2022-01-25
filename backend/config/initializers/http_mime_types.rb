module HTTP
  module MimeType
    # HTML decode MIME type adapter
    class HTML < Adapter
      # Decodes HTML
      def decode(str)
        ::Nokogiri::HTML(str).inner_html
      end
    end

    register_adapter "text/html", HTML
    register_alias "text/html", :html
  end
end
