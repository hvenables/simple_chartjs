module Chartjs
  class Engine < ::Rails::Engine
    initializer 'precompile', group: :all do |app|
      if defined?(Sprockets) && Gem::Version.new(Sprockets::VERSION) >= Gem::Version.new("4.0.0.beta1")
        app.config.assets.precompile << 'simple_chartjs.js'
      else
        app.config.assets.precompile << proc { |path| path == 'simple_chartjs.js' }
      end
    end

    initializer 'helper' do
      ActiveSupport.on_load(:action_view) do
        include ChartHelper
      end
    end
  end
end
