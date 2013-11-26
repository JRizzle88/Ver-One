class Order < ActiveRecord::Base
  resourcify
	has_many :line_items, :dependent => :destroy

	validates :name, :address, :email, presence: true
	PAYMENT_TYPES = [ "Check", "Credit card", "Purchase order" ]
	validates :pay_type, inclusion: PAYMENT_TYPES


  def add_line_items_from_cart(cart)
    cart.line_items.each do |item|
      item.cart_id = nil
      line_items << item
    end
  end

  def total_price
    line_items.to_a.sum{ |item| item.total_price }
  end
  
end
