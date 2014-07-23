class AddBasicDetailsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :phone_number, :decimal
    add_column :users, :home_address, :text
    add_column :users, :work_address, :text
    add_column :users, :position, :string
    add_column :users, :company, :string
    add_column :users, :favorite_color, :string
    add_column :users, :favorite_sport, :string
    add_column :users, :favorite_websites, :text
  end
end
