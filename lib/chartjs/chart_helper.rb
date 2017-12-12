require 'json'
require 'cgi'

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
        <div id=#{CGI.escapeHTML(id)} class=#{CGI.escapeHTML(klass)} style='#{'width: ' + CGI.escapeHTML(width) + ';' if width} #{'height: ' + CGI.escapeHTML(height) + ';' if height}'>
          Loading...
        </div>"
      DIV
    end
  end
end
