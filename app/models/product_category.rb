class ProductCategory < ActiveRecord::Base
  has_many :products, :through => :product_categories
  
  validates :name, presence: true, uniqueness: true
end
