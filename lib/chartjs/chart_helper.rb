require 'json'
require 'erb'

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

    def draw_chart(type, url, dataset_properties: {}, options: {}, **html_options)
      template = chart_template(
        html_options[:id],
        html_options[:class],
        html_options[:width],
        html_options[:height]
      )

      script = <<-JS.gsub(/(?:\A[[:space:]]+|[[:space:]]+\z)/, '').gsub(/[[:space:]]+/, ' ')
        <script type="text/javascript">
          (function() {
            var initChart = function() {
              new SimpleChart(
                '#{type}',
                '#{html_options[:id]}',
                '#{url}',
                '#{dataset_properties.to_json}',
                '#{options.to_json}',
                '#{html_options.to_json}'
              ).createChart();
            };

            if (document.addEventListener) {
              if (typeof(Turbolinks) != 'undefined' && Turbolinks.supported) {
                document.addEventListener("turbolinks:load", initChart, true);
              } else {
                document.addEventListener("load", initChart, true);
              }
            } else if (document.attachEvent) {
              if (typeof(Turbolinks) != 'undefined' && Turbolinks.supported) {
                document.attachEvent("turbolinks:load", initChart);
              } else {
                document.attachEvent("onload", initChart);
              }
            }
          })();
        </script>
      JS

      html = template + script
      html.respond_to?(:html_safe) ? html.html_safe : html
    end

    def chart_template(id, klass, width, height)
      <<-DIV.gsub(/(?:\A[[:space:]]+|[[:space:]]+\z)/, '').gsub(/[[:space:]]+/, ' ')
        <div id=#{ERB::Util.html_escape(id)} class=#{ERB::Util.html_escape(klass)} #{chart_styling(width, height)}>
          Loading...
        </div>
      DIV
    end

    def chart_styling(width, height)
      width = ERB::Util.html_escape(width) if width
      height = ERB::Util.html_escape(height) if height

      <<-CSS.gsub(/(?:\A[[:space:]]+|[[:space:]]+\z)/, '').gsub(/[[:space:]]+/, ' ')
        style='
          #{'width: ' + width + ';' if width}
          #{'height: ' + height + ';' if height}
          text-align: center;
          color: #999;
          font-size: 14px;
          font-family: Verdana;
        '
      CSS
    end
  end
end
