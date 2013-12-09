class LineItem < ActiveRecord::Base 
	resourcify
  validates :product_id, presence: true
  belongs_to :product
  belongs_to :cart
  belongs_to :order
  belongs_to :studio
  
  def total_price
    product.price * quantity
  end
end
