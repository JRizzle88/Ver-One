class Admin < ActiveRecord::Base
	resourcify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :trackable, :validatable, :lockable

  attr_accessor :email, :password, :password_confirmation

end


#module Admin
#  def self.table_name_prefix
#    'admin_'
#  end
# end
