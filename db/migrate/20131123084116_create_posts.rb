class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.text :content
      t.string :image_url

      t.timestamps
    end
  end

  def self.down
    drop_table :products
  end
end
