require 'bundler/setup'
require 'simple_chartjs'
require 'support/chart_helper_return'
require 'pry'

RSpec.configure do |config|
  # Enable flags like --only-failures and --next-failure
  config.example_status_persistence_file_path = '.rspec_status'

  config.include ChartHelperReturn

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end
