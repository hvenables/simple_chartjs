function simpleChart(type, id, url, options) {
  this.ctx        = document.getElementById(id);
  this.chart_type = type;
  this.url        = url;
  this.options    = options;
}

simpleChart.prototype.ajaxCall = function() {
  var chart = this

  return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', chart.url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (xhr.status == 200) {
        resolve(JSON.parse(xhr.response))
      }
    };
    xhr.send();

  });
}

simpleChart.prototype.buildChart = function(data) {
  var myChart = new Chart(this.ctx, {
    type: this.chart_type,
    data: data,
    options: this.options
  });
}

simpleChart.prototype.createChart = function() {
  var chart = this

  chart.ajaxCall().then(function(response) {
    chart.buildChart(response);
  }, function(error) {
    console.error('Vanilla Javascript failed!', error);
  });
}
