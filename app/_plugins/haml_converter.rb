# _plugins/haml_converter.rb

module Jekyll
  class HamlConverter < Converter
    safe true

    def setup
      return if @setup
      require 'haml'
      @setup = true
    rescue
      STDERR.puts 'do `gem install haml`'
      raise FatalException.new("Missing dependency: haml")
    end

    def matches(ext)
      ext =~ /haml/i
    end

    def output_ext(ext)
      ".html"
    end

    def convert(content)
      setup
      Haml::Options.defaults[:attr_wrapper] = '"'
      engine = Haml::Engine.new(content)
      engine.render
    end
  end

  class Random < Liquid::Tag
    def initialize(tag_name, max, tokens)
       super
       @max = max.to_i
    end

    def render(context)
      rand(@max).to_s
    end
  end

  Liquid::Template.register_tag('random', Random)
  
end
