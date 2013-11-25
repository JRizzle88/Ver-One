class Post < ActiveRecord::Base
  has_many :comments, :dependent => :destroy

  validates :title, :content, :image_url, presence: true
  validates :title, uniqueness: true
  validates :image_url, allow_blank: true, format: {
  with: %r{\.(gif|jpg|png)$}i, 
  message: 'Image must contain the following extensions: PNG, GIF, JPG',
  :multiline => true
  }
  validates :title, length: {minimum: 10}
  

end
