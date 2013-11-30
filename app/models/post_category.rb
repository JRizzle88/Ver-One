class PostCategory < ActiveRecord::Base
  has_many :posts, :through => :post_categories

  validates :name, presence: true, uniqueness: true
end
