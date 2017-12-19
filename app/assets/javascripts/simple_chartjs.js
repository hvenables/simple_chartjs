function SimpleChart(type, id, url, width, height, datasetProperties, configurationOptions) {
  this.ctx                  = document.getElementById(id);
  this.chartType            = this.convertToCamelCase(type);
  this.url                  = url;
  this.width                = width;
  this.height               = height;
  this.datasetProperties    = datasetProperties;
  this.configurationOptions = configurationOptions;
}

SimpleChart.prototype.createChart = function() {
  var chart = this;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', chart.url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE) {
      if(xhr.status === 200) {
        chart.buildChart(xhr.response);
      } else {
        console.log('An error occurred during your xhr: ' +  xhr.status + ' ' + xhr.statusText);
      }
    }
  }
  xhr.send();
}

SimpleChart.prototype.buildChart = function(data) {
  var data = JSON.parse(data);
  [this.datasetProperties, this.configurationOptions] = this.chartConfiguration();

  this.ctx.innerHTML = this.canvas();
  var canvas = this.ctx.getElementsByTagName('canvas')[0];

  var myChart = new Chart(canvas, {
    type: this.chartType,
    data: this.formatChartData(data),
    options: this.configurationOptions
  });
}

SimpleChart.prototype.chartConfiguration = function() {
  var optionMethod = this.ctx.dataset['options']

  if(typeof(optionMethod) != "undefined" && typeof(this[this.convertToCamelCase(optionMethod) + "Options"]) != "undefined") {
    return [
      this.configureOption('datasetProperties', JSON.parse(this.datasetProperties), optionMethod),
      this.configureOption('options', JSON.parse(this.configurationOptions), optionMethod)
    ]
  } else {
    return [
      this.formatRubyObject(JSON.parse(this.datasetProperties)),
      this.formatRubyObject(JSON.parse(this.configurationOptions))
    ]
  }
}

SimpleChart.prototype.configureOption = function(option_name, current_options, optionMethod) {
  var options = this[this.convertToCamelCase(optionMethod) + "Options"]()[option_name];

  if(typeof(options) != "undefined") {
    return this.mergeObjects(
      options,
      this.formatRubyObject(current_options)
    )
  } else {
    return this.formatRubyObject(current_options)
  }
}

SimpleChart.prototype.formatChartData = function(data) {
  var chartData = data;
  this.formatArrayRubyObjects(chartData.datasets);
  if(Object.keys(this.datasetProperties).length !== 0) {
    for(property in this.datasetProperties) {
      if(Array.isArray(this.datasetProperties[property])) {
        for (var i = 0; i < chartData.datasets.length; i++) {
          chartData.datasets[i][property] = this.datasetProperties[property][i];
        }
      } else if(typeof(this.datasetProperties[property]) === 'function') {
        for (var i = 0; i < chartData.datasets.length; i++) {
          chartData.datasets[i][property] = this.datasetProperties[property](chartData.datasets[i]);
        }
      } else {
        for (var i = 0; i < chartData.datasets.length; i++) {
          chartData.datasets[i][property] = this.datasetProperties[property];
        }
      }
    }
  }

  return chartData;
}

SimpleChart.prototype.formatArrayRubyObjects = function(array) {
  for (var i = 0; i < array.length; i++) {
    this.formatRubyObject(array[i]);
  }
  return array;
}

SimpleChart.prototype.formatRubyObject = function(object) {
  for (property in object) {
    if(property === 'data' || property === 'label') { continue; }
    value   = object[property];
    delete object[property];

    newKey = this.convertToCamelCase(property);
    object[newKey] = value;

    if(typeof(object[newKey]) == "object") {
      this.formatRubyObject(object[newKey]);
    }
  }
  return object;
}

SimpleChart.prototype.convertToCamelCase = function(string) {
  return string.replace(/[-_]([a-z])/, function(_, letter) {
    return letter.toUpperCase();
  });
}

SimpleChart.prototype.mergeObjects = function(obj, src) {
  Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
  return obj;
}

SimpleChart.prototype.canvas = function() {
  var canvas = '<canvas';
  canvas += ' width="'+ this.ctx.clientWidth + '"';
  canvas += ' height="' + this.ctx.clientHeight + '"';
  canvas += '></canvas>';

  return canvas;
}
