class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def index
    @posts = Post.all.paginate page: params[:page],
      per_page: 6
  end

  def show

  end

  def new
    @posts = Post.new
  end

  def edit
  end

  def create
    @post = Post.new(post_params) 
 
    respond_to do |format|
      if @post.save
        format.html  { redirect_to [:admin, @post],
          notice: 'Post was successfully created.' }
        format.json  { render action: 'show',
          status: :created, location: @post }
      else
        format.html  { render action: "new" }
        format.json  { render json: @post.errors,
          status: :unprocessable_entity }
      end
    end
  end

  def update
    @post = Post.find(params[:id])
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
    @post = Post.find(params[:id])
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
      params.require(:post).permit(:title, :image_url, :content)
    end
    
end