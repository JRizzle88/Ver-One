# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Verone::Application.initialize!

# connect to host
config.action_mailer.default_url_options = { :host => 'verone.heroku.com' }