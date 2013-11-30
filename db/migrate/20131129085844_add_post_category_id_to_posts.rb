class AddPostCategoryIdToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :post_category_id, :integer
  end
end
