require 'spec_helper'
require 'chartjs/chart_helper'

RSpec.describe Chartjs::ChartHelper do
  let(:dummy_class) { Class.new { include Chartjs::ChartHelper } }

  context '.line_chart' do
    context 'When no html_options are supplied' do
      subject { dummy_class.new.line_chart('/test_url') }

      it { is_expected.to eq chart_helper_return('line', '/test_url', 'chart-1', '', '100%', '300px') }
    end

    context 'When chart has no id' do
      subject { dummy_class.new.line_chart('/test_url', class: 'test-class') }

      it { is_expected.to eq chart_helper_return('line', '/test_url', 'chart-1', 'test-class', '100%', '300px') }
    end

    context 'When chart has no class' do
      subject { dummy_class.new.line_chart('/test_url', id: 'test-id') }

      it { is_expected.to eq chart_helper_return('line', '/test_url', 'test-id', '', '100%', '300px') }
    end

    context 'When both class and id are supplied' do
      subject { dummy_class.new.line_chart('/test_url', id: 'test-id', class: 'test-class') }

      it { is_expected.to eq chart_helper_return('line', '/test_url', 'test-id', 'test-class', '100%', '300px') }
    end

    context 'When all html options are specified' do
      subject { dummy_class.new.line_chart('/test_url', id: 'test-id', class: 'test-class', width: '500px', height: '500px') }

      it { is_expected.to eq chart_helper_return('line', '/test_url', 'test-id', 'test-class', '500px', '500px') }
    end
  end

  context 'Chart methods have been defined' do
    subject { dummy_class.new.methods.grep(/\w+_chart/) }

    described_class::CHART_TYPES.each do |chart_type|
      it { is_expected.to include "#{chart_type}_chart".to_sym }
    end
  end
end
