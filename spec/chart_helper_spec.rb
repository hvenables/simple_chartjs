require 'spec_helper'
require 'chartjs/chart_helper'

RSpec.describe Chartjs::ChartHelper do
  let(:dummy_class) { Class.new { include Chartjs::ChartHelper } }

  context '.line_chart' do
    subject { dummy_class.new.line_chart('/test_url', id: 'test-id', class: 'test-class') }

    it { binding.pry }
  end

end
