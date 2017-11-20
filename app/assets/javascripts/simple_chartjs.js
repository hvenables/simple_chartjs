function simpleChart(type, id, url, dataset_properties, options) {
  this.ctx                = document.getElementById(id);
  this.chart_type         = type;
  this.url                = url;
  this.dataset_properties = this.format_data(JSON.parse(dataset_properties))
  this.chartOptions       = this.options()[id]
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
    data: this.formatChartData(data),
    options: this.chartOptions
  });
}

simpleChart.prototype.formatChartData = function(data) {
  chartData = this.format_array_data(data)
  if(!(Object.keys(this.dataset_properties).length === 0)) {
    for(property in this.dataset_properties) {
      if(Array.isArray(this.dataset_properties[property])) {
        for (var i = 0; i < this.dataset_properties[property].length; i++) {
          chartData.datasets[i][property] = this.dataset_properties[property][i]
        }
      } else {
        for (var i = 0; i < chartData.datasets.length; i++) {
          chartData.datasets[i][property] = this.dataset_properties[property]
        }
      }
    }
  }
  return chartData
}

simpleChart.prototype.createChart = function() {
  var chart = this

  chart.ajaxCall().then(function(response) {
    chart.buildChart(response);
  }, function(error) {
    console.error('Vanilla Javascript failed!', error);
  });
}

simpleChart.prototype.format_array_data = function(dataset) {
  for (var i = 0; i < dataset.datasets.length; i++) {
    this.format_data(dataset.datasets[i])
  }
  return dataset
}

simpleChart.prototype.format_data = function(dataset) {
  for (property in dataset) {
    value   = dataset[property]
    new_key = this.snakeCaseToCamelCase(property)

    delete dataset[property]

    dataset[new_key] = value
  }
  return dataset
}

simpleChart.prototype.snakeCaseToCamelCase = function(string) {
  return string.replace(/(?<=_)[a-z]/, function(l) { return l.toUpperCase() }).replace(/_/, '')
}
