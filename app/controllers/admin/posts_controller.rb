class Admin::PostsController < ApplicationController
  
  layout 'dashboard'

  before_filter :authenticate_user!
  before_filter do 
      redirect_to new_user_session_path unless current_user && current_user.admin?
  end

  before_action :set_post, only: [:show, :edit, :update, :destroy]

  # GET /admin/posts
  def index
  @posts = Post.all
  end

  def show
  end

  def new
    @post = Post.new
  end

  def edit
    #@post = Post.find(params[:id])
  end

  def create
    @post = Post.new(post_params)
  
    respond_to do |format|
      if @post.save
        format.html { redirect_to [:admin_posts, @post],
          notice: 'Post was successfully created.' }
        format.json { render action: 'show', status: :created, 
          location: [:admin, @post] }
      else
        format.html { render action: "new" }
        format.json { render json: @post.errors,
          status: :unprocessable_entity }
      end
    end
  end

  def update
    #@post = Post.find(params[:id]) 
    respond_to do |format|
      if @post.update(post_params)
        format.html  { redirect_to [:admin_posts, @post],
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
    #@post = Post.find(params[:id])
    @post.destroy
    respond_to do |format|
      format.html { redirect_to [:admin_posts, @post] }
      format.json { head :no_content }
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
     params.require(:title).permit(:title, :content, :image_url)
  end

end
