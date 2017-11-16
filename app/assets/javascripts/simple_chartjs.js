function simpleChart(type, id, url, options) {
  this.ctx          = document.getElementById(id);
  this.chart_type   = type;
  this.url          = url;
  this.chartOptions = this.options()[id]
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
    data: this.format_data(data),
    options: this.chartOptions
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

simpleChart.prototype.format_data = function(dataset) {
  for (var i = 0; i < dataset.datasets.length; i++) {
    for (property in dataset.datasets[i]) {
      value   = dataset.datasets[i][property]
      new_key = this.snakeCaseToCamelCase(property)

      delete dataset.datasets[i][property]

      dataset.datasets[i][new_key] = value
    }
  }
  return dataset
}

simpleChart.prototype.snakeCaseToCamelCase = function(string) {
  return string.replace(/(?<=_)[a-z]/, function(l) { return l.toUpperCase() }).replace(/_/, '')
}
