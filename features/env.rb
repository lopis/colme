require 'rspec/expectations'
require 'capybara'
require 'capybara/mechanize'
require 'capybara/cucumber'
require 'test/unit/assertions'
require 'mechanize'

World(Test::Unit::Assertions)

Capybara.default_driver = :mechanize
Capybara.app_host = "http://www.html.dev/colme/"
World(Capybara)
