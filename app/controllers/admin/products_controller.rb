class Admin::ProductsController < ApplicationController
  
  layout 'dashboard'

  before_filter :authenticate_user!
  before_filter do 
      redirect_to new_user_session_path unless current_user && current_user.admin?
  end
  
  before_action :set_product, only: [:show, :edit, :update, :destroy]
  before_action :set_product_category, only: [:show, :edit, :update, :destroy]
  # GET /products
  # GET /products.json
  def index
    @products = Product.all.paginate page: params[:page],
      per_page: 10,
      :order => 'updated_at DESC'
  end

  # GET /products/1
  # GET /products/1.json
  def show
  
  end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit
  end

  # POST /products
  # POST /products.json
  def create
    @product = Product.new(product_params)
    respond_to do |format|
      if @product.save
        format.html { redirect_to [:admin_products, @products], 
          notice: 'Product was successfully created.' }
        format.json { render action: 'show', 
          status: :created, location: @product }
      else
        format.html { render action: 'new' }
        format.json { render json: @product.errors, 
          status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/1
  # PATCH/PUT /products/1.json
  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html  { redirect_to edit_admin_product_path(@product), 
          notice: 'Successfully Updated.', class: 'alert-box success radius' }
        format.json  { head :no_content }
      else
        format.html  { render action: 'edit' }
        format.json  { render json: @product.errors, 
          status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1
  # DELETE /products/1.json
  def destroy
    @product.destroy
    respond_to do |format|
      format.html { redirect_to [:admin_products, @products] }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    def set_product_category
      @product_category = ProductCategory.new
    end
    
    # Never trust parameters from the scary internet, only allow the white list through.
    def product_params
      params.require(:product).permit(:title, :description, :image_url, :price)
    end
end
