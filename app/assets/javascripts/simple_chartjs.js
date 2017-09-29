function SimpleChart(type, id, url, options) {
  this.chart_type = type;
  this.id         = id;
  this.url        = url;
  this.options    = options;
}

SimpleChart.prototype.ajaxCall = function(url) {
  var chart = this
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    if (xhr.status == 200) {
      chart.createChart(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}

SimpleChart.prototype.createChart = function(data) {
  var ctx = document.getElementById(this.id);
  var myChart = new Chart(ctx, {
    type: this.chart_type,
    data: data,
    options: this.options
  });
}
