function SimpleChart(type, id, url, datasetProperties, configurationOptions) {
  this.ctx                = document.getElementById(id);
  this.chart_type         = type;
  this.url                = url;
  this.configureOptions(id, datasetProperties, configurationOptions);
}

SimpleChart.prototype.configureOptions = function(id, datasetProperties, configurationOptions) {
  var options = this[this.kebabCaseToCamelCase(id) + "Options"]();

  this.datasetProperties = this.merge(options['datasetProperties'], this.format_data(JSON.parse(datasetProperties)));
  this.configurationOptions = this.merge(options['options'], this.format_data(JSON.parse(configurationOptions)));
}

SimpleChart.prototype.getData = function() {
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

SimpleChart.prototype.buildChart = function(data) {
  var myChart = new Chart(this.ctx, {
    type: this.chart_type,
    data: this.formatChartData(data),
    options: this.configurationOptions
  });
}

SimpleChart.prototype.createChart = function() {
  var chart = this

  chart.getData().then(function(response) {
    chart.buildChart(response);
  }, function(error) {
    console.error('Vanilla Javascript failed!', error);
  });
}

SimpleChart.prototype.formatChartData = function(data) {
  chartData = this.format_array_data(data)
  if(!(Object.keys(this.datasetProperties).length === 0)) {
    for(property in this.datasetProperties) {
      if(Array.isArray(this.datasetProperties[property])) {
        for (var i = 0; i < this.datasetProperties[property].length; i++) {
          chartData.datasets[i][property] = this.datasetProperties[property][i]
        }
      } else {
        for (var i = 0; i < chartData.datasets.length; i++) {
          chartData.datasets[i][property] = this.datasetProperties[property]
        }
      }
    }
  }
  return chartData
}

SimpleChart.prototype.format_array_data = function(dataset) {
  for (var i = 0; i < dataset.datasets.length; i++) {
    this.format_data(dataset.datasets[i])
  }
  return dataset
}

SimpleChart.prototype.format_data = function(dataset) {
  for (property in dataset) {
    value   = dataset[property]
    new_key = this.snakeCaseToCamelCase(property)

    delete dataset[property]

    dataset[new_key] = value
  }
  return dataset
}

SimpleChart.prototype.snakeCaseToCamelCase = function(string) {
  return string.replace(/(?<=_)[a-z]/, function(l) { return l.toUpperCase() }).replace(/_/, '')
}

SimpleChart.prototype.kebabCaseToCamelCase = function(string) {
  return string.replace(/(?<=-)[a-z]/, function(l) { return l.toUpperCase() }).replace(/-/, '')
}

SimpleChart.prototype.merge = function(obj, src) {
  Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
  return obj;
}
