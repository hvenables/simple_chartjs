require 'json'
require 'erb'
require 'class_extensions/squish'

module Chartjs
  module ChartHelper
    using Squish

    CHART_TYPES = %i[
      line bar horizontal_bar radar doughnut pie polar_area bubble scatter area mixed
    ].freeze

    CHART_TYPES.each do |chart|
      define_method "#{chart}_chart" do |url, options = {}|
        draw_chart chart, url, options
      end
    end

    private

    def draw_chart(type, url, dataset_properties: {}, options: {}, **html_options)
      html_options = configure_html_options(html_options)

      template = chart_template(
        html_options[:id],
        html_options[:class],
        html_options[:width],
        html_options[:height],
        html_options[:data]
      )

      script = <<-JS.squish
        <script type="text/javascript">
          (function() {
            var initChart = function() {
              new SimpleChart(
                '#{type}',
                '#{html_options[:id]}',
                '#{url}',
                '#{html_options[:width]}',
                '#{html_options[:height]}',
                '#{dataset_properties.to_json}',
                '#{options.to_json}'
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

    def configure_html_options(html_options)
      html_options[:id]     ||= "chart-#{chart_id}"
      html_options[:width]  ||= '100%'
      html_options[:height] ||= '300px'
      html_options
    end

    def chart_template(id, klass, width, height, data)
      <<-DIV.squish
        <div id="#{ERB::Util.html_escape(id)}" class="#{ERB::Util.html_escape(klass)}" #{data_attributes(data)} #{chart_styling(width, height)}>
          Loading...
        </div>
      DIV
    end

    def chart_styling(width, height)
      width = ERB::Util.html_escape(width)
      height = ERB::Util.html_escape(height)

      <<-CSS.squish
        style="
          #{'width: ' + width + ';'}
          #{'height: ' + height + ';'}
          text-align: center;
          color: #999;
          font-size: 14px;
          font-family: Verdana;
          #{'line-height: ' + height + ';'}
        "
      CSS
    end

    def data_attributes(data)
      return unless data

      data.map do |key, value|
        "data-#{ERB::Util.html_escape(key)}='#{ERB::Util.html_escape(value)}'"
      end.join(' ')
    end

    def chart_id
      @chart_id ||= 0
      @chart_id += 1
    end
  end
end
