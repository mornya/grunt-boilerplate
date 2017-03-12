module Sass::Script::Functions
    def timestamp()
        return Sass::Script::String.new(Time.now.strftime("%Y%m%d%H%M"))
    end
end
