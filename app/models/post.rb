class Post < ActiveRecord::Base
  has_many :comments, :dependent => :destroy
  has_many :image_posts
  has_and_belongs_to_many :post_categories

#post image // paperclip
  #has_attached_file :image_posts,
    #:styles => { :post_page => "550x550>", :post_image => "220x220>", :post_thumb => "75x75>",
    #:path => ":rails_root/public/system/:attachment/:id/:style/:filename",
    #:url => "/system/:attachment/:id/:style/:filename" }

#post validations
  validates :title, presence: true
  validates :title, uniqueness: true
  validates :image_url, allow_blank: true, format: {
  with: %r{\.(gif|jpg|png)$}i, 
  message: 'Image must contain the following extensions: PNG, GIF, JPG',
  :multiline => true
  }
  


  #recreates images to allow custom path for uploads
  #namespace :paperclip do
  #desc "Recreate attachments and save them to new destination"
  #task :move_attachments => :environment do
  #
   # Post.find_each do |post|
    #  unless post.image_posts_file_name.blank?
     #   filename = Rails.root.join('public', 'system', 'images', post.id.to_s, 'original', post.image_posts_file_name)
  #   
   #     if File.exists? filename
    #      puts "Re-saving image attachment #{post.id} - #{filename}"
     #     image = File.new filename
      ##    post.image_posts = image
        #  post.save
        # if there are multiple styles, you want to recreate them :
      #    post.image_posts.reprocess! 
     #     image_posts.close
    #    end
   #   end
  #  end
 # end
#  end
  
  def image_post
    image_posts.collect{|p| p.image_posts.url}
  end

end
