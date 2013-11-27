class Product < ActiveRecord::Base
  resourcify
  has_many :line_items
  has_many :orders, :through => :line_items



  validates :title, :description, :image_url, presence: true
  validates :price, numericality: {greater_than_or_equal_to: 0.01}
  validates :title, uniqueness: true
  validates :image_url, allow_blank: true, format: {
    with: %r{\.(gif|jpg|png)$}i, 
    message: 'Image must contain the following extensions: PNG, GIF, JPG',
    :multiline => true
  }
  validates :title, length: {minimum: 10}
  
  default_scope { order('external_updated_at') }
  
  before_destroy :ensure_not_referenced_by_any_line_item

  def ensure_not_referenced_by_any_line_item
    if line_items.count.zero?
      return true
    else
      errors.add(:base, 'Line Items Present')
      return false
    end
  end
end
