# Simple ChartJS

Simple Ruby wrapper for using [ChartJS](http://www.chartjs.org/)

## Current ChartJS version

Includes - [2.7.1](https://github.com/chartjs/Chart.js/releases/tag/v2.7.1)

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'simple_chartjs'
```

In `application.js`, add:

```javascript
//= require Chart.bundle
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
  def chart_data
    render json: Model.group_by_day(:completed_at).count
  end
end
```

At its simplest a chart can be produced by the following
```ruby
<%= line_chart           chart_data_path %>
<%= bar_chart            chart_data_path %>
<%= horizontal_bar_chart chart_data_path %>
<%= radar_chart          chart_data_path %>
<%= polar_area_chart     chart_data_path %>
<%= pie_chart            chart_data_path %>
<%= doughnut_chart       chart_data_path %>
<%= bubble_chart         chart_data_path %>
<%= scatter_chart        chart_data_path %>
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

##### Javascript/Coffescript
If you want more control from a javascript perspective you can set a function that the chart will call and add those dataset options. To do this you name a method as a data attribute call options like below.
```ruby
bar_chart chart_data_path, data: { options: 'bar-chart' }
```
In the javascript you create a function on SimpleChart
```javascript
SimpleChart.prototype.barChartOptions = function() {
  return {
    datasetProperties: {
      borderWidth: 4
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

