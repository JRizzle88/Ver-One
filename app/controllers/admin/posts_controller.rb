class Admin::PostsController < InheritedResources::Base
before_filter :authenticate_user!
def index
  @posts = Post.all
 
  respond_to do |format|
  format.html  # index.html.erb
  format.json  { render :json => @posts }
end
end

def create
  @post = Post.new(params[:post].permit(:title, :content, :image_url))
  
  respond_to do |format|
    if @post.save
      format.html  { redirect_to(@post,
                    :notice => 'Post was successfully created.') }
      format.json  { render :json => @post,
                    :status => :created, :location => @post }
    else
      format.html  { render :action => "new" }
      format.json  { render :json => @post.errors,
                    :status => :unprocessable_entity }
    end
  end
end

def show
  @post = Post.find(params[:id])
 
  respond_to do |format|
    format.html  # show.html.erb
    format.json  { render :json => @post }
  end
end

def edit
  @post = Post.find(params[:id])
end

def update
  @post = Post.find(params[:id])
 
  respond_to do |format|
    if @post.update(params[:post].permit(:title, :content, :image_url))
      format.html  { redirect_to(@post,
                    :notice => 'Post was successfully updated.') }
      format.json  { head :no_content }
    else
      format.html  { render :action => "edit" }
      format.json  { render :json => @post.errors,
                    :status => :unprocessable_entity }
    end
  end
end

def destroy
  @post = Post.find(params[:id])
  @post.destroy
 
  respond_to do |format|
    format.html { redirect_to posts_url }
    format.json { head :no_content }
  end
end

private
 def post_params
     params.require(:title).permit(:image_url, :content)
 end

end
