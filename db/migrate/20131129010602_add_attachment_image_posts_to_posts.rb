class AddAttachmentImagePostsToPosts < ActiveRecord::Migration
  def self.up
    #change_table :posts do |t|
    #  t.attachment :image_posts
    #end
    add_attachment :posts, :image_posts
  end

  def self.down
    drop_attached_file :posts, :image_posts
  end
end
