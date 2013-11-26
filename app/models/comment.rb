class Comment < ActiveRecord::Base
	resourcify
  	belongs_to :post
end
