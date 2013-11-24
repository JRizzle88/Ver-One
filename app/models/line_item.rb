class LineItem < ActiveRecord::Base 
  validates :product_id, presence: true
  belongs_to :product
  belongs_to :cart
  belongs_to :order
  
  def total_price
    product.price * quantity
  end
end
