class AddAttachmentImageToProducts < ActiveRecord::Migration
  def self.up
    add_attachment :products, :image_products
  end

  def self.down
    remove_attachment :products, :image_products
  end
end
