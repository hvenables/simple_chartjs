require 'chartjs/chart_helper'

module Chartjs
  class Engine < ::Rails::Engine
    initializer 'precompile', group: :all do |app|
      app.config.assets.precompile << 'google_chart.js'
    end

    initializer 'helper' do
      ActiveSupport.on_load(:action_view) do
        include ChartHelper
      end
    end
  end
end
