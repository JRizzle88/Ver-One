class Admin::PostsController < ApplicationController
  
  layout 'dashboard'

  before_filter :authenticate_user!
  before_filter do 
      redirect_to new_user_session_path unless current_user && current_user.admin?
  end

  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def index
    @posts = Post.paginate page: params[:page],
      per_page: 10

  end

  def show
  end

  def new
    @post = Post.new
  end

  def edit
  end

  def create
    @post = Post.new(post_params)
    respond_to do |format|
      if @post.save
        format.html { redirect_to [:admin_posts, @posts],
          notice: 'Post was successfully created.' }
        format.json { render action: 'show', status: :created, 
          location: @post }
      else
        format.html { render action: "new" }
        format.json { render json: @post.errors,
          status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html  { redirect_to [:admin_posts, @posts],
          notice: 'Post was successfully updated.' }
        format.json  { head :no_content }
      else
        format.html  { render action: "edit" }
        format.json  { render json: @post.errors,
          status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to [:admin_posts, @posts] }
      format.json { head :no_content }
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
     params.require(:post).permit(:title, :content, :image_url)
  end

end
