module Chartjs
  class Engine < ::Rails::Engine
    initializer 'helper' do
      ActiveSupport.on_load(:action_view) do
        include ChartHelper
      end
    end
  end
end
