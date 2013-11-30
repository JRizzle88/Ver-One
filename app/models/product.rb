class Product < ActiveRecord::Base
  resourcify
  has_many :line_items
  has_many :orders, :through => :line_items
  has_many :image_products
  has_and_belongs_to_many :product_categories
  

#product image // paperclip
  #has_attached_file :image,
    #:styles => { :product_page => "550x550>", :product_image => "220x220>", :product_thumb => "75x75>",
    #:path => ":rails_root/public/system/:attachment/:id/:style/:filename",
    #:url => "/system/:attachment/:id/:style/:filename" }



#product validations
  validates :title, presence: true
  validates :price, numericality: {greater_than_or_equal_to: 0.01}
  validates :title, uniqueness: true
  validates :image_url, allow_blank: true, format: {
    with: %r{\.(gif|jpg|png)$}i, 
    message: 'Image must contain the following extensions: PNG, GIF, JPG',
    :multiline => true
  }
  
  
  before_destroy :ensure_not_referenced_by_any_line_item

  def ensure_not_referenced_by_any_line_item
    if line_items.count.zero?
      return true
    else
      errors.add(:base, 'Line Items Present')
      return false
    end
  end

  def Product.random
    self.limit(1).offset(rand(self.count)).first 
  end
end
