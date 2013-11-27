# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# Environment variables (ENV['...']) can be set in the file config/application.yml.
# See http://railsapps.github.io/rails-environment-variables.html
puts 'ROLES'
YAML.load(ENV['ROLES']).each do |role| puts role
 # Role.create([{name: 'admin'}, {name: 'staff'}, {name: 'customer'}])
 # Role.find_or_create_by_name({ :name => role }, :without_protection=> true)
 # puts 'role: ' << role
end
puts 'DEFAULT USERS'
#user = User.create([{email: 'admin@admin.com', name: 'super', password: 'admintest123', password_confirmation: 'admintest123'}])
user = User.find_or_create_by(name: ENV['ADMIN_NAME'].dup, email: ENV['ADMIN_EMAIL'].dup, password: ENV['ADMIN_PASSWORD'].dup, password_confirmation: ENV['ADMIN_PASSWORD'].dup)
# user = User.create! :name => 'admin', :email => 'jrizzle8888@gmail.com', :password => 'verone123', :password_confirmation => 'verone123'
puts 'user: ' << user.name
user.confirm!
user.add_role :admin
user.save!





puts 'EXAMPLE PRODUCTS'
Product.create(:title => 'One',
  :description => 
    %{<p>
        Product One
      </p>},
  :image_url =>   '/images/test.jpg',    
  :price => 42.95)
# . . .
Product.create(:title => 'Two',
  :description =>
    %{<p>
        product two
      </p>},
  :image_url => '/images/test.jpg',
  :price => 49.50)
# . . .

Product.create(:title => 'Three',
  :description => 
    %{<p>
       product three
      </p>},
  :image_url => '/images/test.jpg',
  :price => 43.75)
