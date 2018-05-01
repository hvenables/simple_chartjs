# Simple ChartJS

Simple Ruby wrapper for using [ChartJS](http://www.chartjs.org/)

## Current ChartJS version

Includes - [2.7.2](https://github.com/chartjs/Chart.js/releases/tag/v2.7.2)

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'simple_chartjs'
```

In `application.js`, add:

Choose the appropriate ChartJS file depending on if you want it bundled with
MomentJS:

- Without Moment.js:
  ```javascript
  //= require Chart
  ```

- With Moment.js:
  ```javascript
  //= require Chart.bundle
  ```

Then require the simple_chartjs file

```javascript
//= require simple_chartjs
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install simple_chartjs

## Usage

For faster load times simple chartjs expects you to have controllers and routes for the data to be loaded from

```ruby
class ChartsController < ApplicationController
  def show
    render json: chart_data.to_json
  end

  private

  def chart_data
    {
      datasets: [{ data: [...] }],
      labels: [...]
    }
  end
end
```

At its simplest a chart can be produced by the following
```erb
<%= line_chart           chart_path %>
<%= bar_chart            chart_path %>
<%= horizontal_bar_chart chart_path %>
<%= radar_chart          chart_path %>
<%= polar_area_chart     chart_path %>
<%= pie_chart            chart_path %>
<%= doughnut_chart       chart_path %>
<%= bubble_chart         chart_path %>
<%= scatter_chart        chart_path %>
```

### HTML Options
`id`, `class`, `width`, `height`, `data` are passed directly to the chart

```ruby
line_chart chart_data_path, id: 'test-id', class: 'test-class', width: '100%', height: '500px', data: { options: 'test-options' }
```
Width and Heigth can be given either as a percentage or as pixels.

### Chart Options

Simple ChartJS follows the same patterns as ChartJS. There is dataset properties for configuring options on the data and also options for the chart itself.

#### Dataset Properties

There are three ways in which the dataset properties can be set.

##### Controller
The dataset properties can be set in the controller like below.

```ruby
def data
  {
    labels: [...],
    datasets: [
      {
        label: "My First dataset",
        data: [...],
        border_width: 4  # <-- (any of the properties listed as dataset properties in chartjs can be added to the hash)
      }
    ]
  }
end
```

##### View
The dataset properties can be set in the view like below.
```ruby
bar_chart chart_data_path, dataset_properties: { border_width: 4 }
```

##### Javascript
If you want more control from a javascript perspective you can set a function that the chart will call and add those dataset properties. To do this you name a method as a data attribute call options like below.
```ruby
bar_chart chart_data_path, data: { options: 'my-chart' }
```
In the javascript you create a function on SimpleChart
```javascript
SimpleChart.prototype.myChartOptions = function() {
  return {
    datasetProperties: {
      borderWidth: 4
    },
    options: {...}
  }
}
```

If you need to dynamically set a value such as Background Color for each value in the dataset, datasetProperties does support callbacks as shown below. The function will receive one argument, which is the current dataset.

```javascript
SimpleChart.prototype.myChartOptions = function() {
  return {
    datasetProperties: {
      backgroundColor: function(data) {
        ...
      }
    },
    options: {...}
  }
}
```

#### Configuration Options
There are two ways in which the Configuration options can be set.

##### View
The configuration options can be set in the view like below.
```ruby
bar_chart chart_data_path, options: { scales: { x_axes: [{ bar_percentage: 0.2}] } }
```

##### Javascript
If you want more control from a javascript perspective you can set a function that the chart will call and add those configuration options. To do this you name a method as a data attribute call options like below.
```ruby
bar_chart chart_data_path, data: { options: 'my-chart' }
```
In the javascript you create a function on SimpleChart
```javascript
SimpleChart.prototype.myChartOptions = function() {
  return {
    datasetProperties: {...},
    options: {
      scales: {
        xAxes: [{ barPercentage: 0.2 }]
      }
    }
  }
}
```
## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/hvenables/simple_chartjs. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

