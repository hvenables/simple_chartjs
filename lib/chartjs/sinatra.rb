require 'sinatra/base'

module Sinatra
  class Base
    helpers Chartjs::ChartHelper
  end
end
