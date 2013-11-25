class Admin < ActiveRecord::Base

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

end


#module Admin
#  def self.table_name_prefix
#    'admin_'
#  end
# end
