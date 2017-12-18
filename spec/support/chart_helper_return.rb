require 'class_extensions/squish'

module ChartHelperReturn
  using Squish

  def chart_helper_return(chart_type, url, id, klass, width, height)
    chart_html(id, klass, width, height) +
      chart_javascript(chart_type, url, id, width, height)
  end

  def chart_html(id, klass, width, height)
    <<-HTML.squish
      <div id="#{id}" class="#{klass}" style=" width: #{width}; height: #{height}; text-align: center; color: #999; font-size: 14px; font-family: Verdana; line-height: #{height} ">
        Loading...
      </div>
    HTML
  end

  def chart_javascript(chart_type, url, id, width, height)
    <<-JS.squish
      <script type="text/javascript">
        (function() {
          var initChart = function() {
            new SimpleChart(
              '#{chart_type}',
              '#{id}',
              '#{url}',
              '#{width}',
              '#{height}',
              '{}',
              '{}'
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
  end
end
