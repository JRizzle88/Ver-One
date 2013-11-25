class User < ActiveRecord::Base
  has_and_belongs_to_many :roles
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  # :token_authenticatable(new way here = https://gist.github.com/josevalim/fb706b1e933ef01e4fb6)
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable

def admin?
	admin
end


end
