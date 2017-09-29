# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'chartjs/version'

Gem::Specification.new do |spec|
  spec.name          = "simple_chartjs"
  spec.version       = SimpleChartjs::VERSION
  spec.authors       = ["Harry Venables"]
  spec.email         = ["venablesh@yahoo.co.uk"]

  spec.summary       = %q{Chartjs for Rails}
  spec.description   = %q{Provides a wrapper for chartjs for rails allowing full functionality}
  spec.homepage      = "TODO: Put your gem's website or public repo URL here."
  spec.license       = "MIT"


  spec.files         = `git ls-files -z`.split("\x0").reject do |f|
    f.match(%r{^(test|spec|features)/})
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.14"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "rspec", "~> 3.0"
end
