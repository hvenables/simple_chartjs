module Chartjs
  module ChartHelper
    CHART_TYPES = %i[
      line bar radar doughnut pie polar_area bubble scatter area mixed
    ].freeze

    CHART_TYPES.each do |chart|
      define_method "#{chart}_chart" do |url, options = {}|
        draw_chart chart, url, options
      end
    end

    private

    def draw_chart(type, url, options)
      id = options.delete(:id)
      template = chart_template(
        id,
        options.delete(:class),
        options.delete(:width),
        options.delete(:height)
      )

      script = javascript_tag do
        "(new simpleChart('#{type}', '#{id}', '#{url}')).createChart();".html_safe
      end

      template + script
    end

    def chart_template(id, klass, width, height)
      content_tag :canvas, '', id: id, class: klass, width: width, height: height
    end
  end
end
