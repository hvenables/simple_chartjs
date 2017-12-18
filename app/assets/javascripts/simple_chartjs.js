function SimpleChart(type, id, url, width, height, datasetProperties, configurationOptions) {
  this.ctx         = document.getElementById(id);
  this.chartType   = type;
  this.url         = url;
  this.width       = width
  this.height      = height

  this.assignOptions(datasetProperties, configurationOptions);
}

SimpleChart.prototype.assignOptions = function(datasetProperties, configurationOptions) {
  [this.datasetProperties, this.configurationOptions] = this.configureOptions(datasetProperties, configurationOptions)
}

SimpleChart.prototype.configureOptions = function(datasetProperties, configurationOptions) {
  var optionMethod = this.ctx.dataset['options']

  if(typeof(optionMethod) != "undefined" && typeof(this[this.kebabCaseToCamelCase(optionMethod) + "Options"]) != "undefined") {

    return [
      this.configureOption('datasetProperties', JSON.parse(datasetProperties), optionMethod),
      this.configureOption('options', JSON.parse(configurationOptions), optionMethod)
    ]
  } else {
    return [
      this.formatRubyObject(JSON.parse(datasetProperties)),
      this.formatRubyObject(JSON.parse(configurationOptions))
    ]
  }
}

SimpleChart.prototype.configureOption = function(option_name, current_options, optionMethod) {
  var options = this[this.kebabCaseToCamelCase(optionMethod) + "Options"]()[option_name];

  if(typeof(options) != "undefined") {
    return this.mergeObjects(
      options,
      this.formatRubyObject(current_options)
    )
  } else {
    return this.formatRubyObject(current_options)
  }
}

SimpleChart.prototype.buildChart = function(data) {
  var data = JSON.parse(data)

  this.ctx.innerHTML = this.canvas();
  var canvas = this.ctx.getElementsByTagName('canvas')[0]

  var myChart = new Chart(canvas, {
    type: this.chartType,
    data: this.formatChartData(data),
    options: this.configurationOptions
  });
}

SimpleChart.prototype.createChart = function() {
  var chart = this

  var xhr = new XMLHttpRequest();
  xhr.open('GET', chart.url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      console.log("loading")
      if(xhr.status === 200) {
        chart.buildChart(xhr.response)
      } else {
        console.log('An error occurred during your xhr: ' +  xhr.status + ' ' + xhr.statusText);
      }
    }
  }
  xhr.send();
}

SimpleChart.prototype.formatChartData = function(data) {
  var chartData = data
  this.formatArrayRubyObjects(chartData.datasets)
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

SimpleChart.prototype.formatArrayRubyObjects = function(array) {
  for (var i = 0; i < array.length; i++) {
    this.formatRubyObject(array[i])
  }
  return array
}

SimpleChart.prototype.formatRubyObject = function(object) {
  for (property in object) {
    if(property === 'data' || property === 'label') { continue; }
    value   = object[property]
    delete object[property]

    newKey = this.snakeCaseToCamelCase(property)
    object[newKey] = value

    if(typeof(object[newKey]) == "object") {
      this.formatRubyObject(object[newKey])
    }
  }
  return object
}

SimpleChart.prototype.snakeCaseToCamelCase = function(string) {
  return string.replace(/_([a-z])/, function(_, letter) {
    return letter.toUpperCase()
  })
}

SimpleChart.prototype.kebabCaseToCamelCase = function(string) {
  return string.replace(/-([a-z])/, function(_, letter) {
    return letter.toUpperCase()
  })
}

SimpleChart.prototype.mergeObjects = function(obj, src) {
  Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
  return obj;
}

SimpleChart.prototype.canvas = function() {
  var canvas = '<canvas'
  canvas += (this.width == '100%' ? ' width="'+ this.ctx.clientWidth + '"' : ' width="' + this.width.replace(/px/, '') + '"');
  canvas += ' height="' + this.height.replace(/px/, '') + '"'
  canvas += '></canvas>'

  return canvas
}
