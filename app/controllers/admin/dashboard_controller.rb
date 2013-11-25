class Admin::DashboardController < ApplicationController

	layout 'dashboard'

	before_filter :authenticate_user!
	before_filter do 
    	redirect_to new_user_session_path unless current_user && current_user.admin?
  	end

def index
    @users = User.all
    @users = User.paginate(:page => params[:page])
    #respond_to do |format|
    #format.html # index.html.erb
    #format.json { render json: @users }
    #end
end

def show
end

end
