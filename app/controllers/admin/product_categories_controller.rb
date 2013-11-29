class Admin::ProductCategoriesController < ApplicationController
  before_action :set_product_category, only: [:show, :edit, :update, :destroy]

  layout 'dashboard'

  before_filter :authenticate_user!
  before_filter do 
      redirect_to new_user_session_path unless current_user && current_user.admin?
  end

  # GET /product_categories
  # GET /product_categories.json
  def index
    @product_categories = ProductCategory.all.paginate page: params[:page],
      per_page: 10

    @product_category = ProductCategory.new
  end

  # GET /product_categories/1
  # GET /product_categories/1.json
  def show
    @product_categories = ProductCategory.find(params[:id])
  end

  # GET /product_categories/new
  def new
    @product_category = ProductCategory.new

    @product_categories = ProductCategory.all.paginate page: params[:page],
      per_page: 10
  end

  # GET /product_categories/1/edit
  def edit
  end

  # POST /product_categories
  # POST /product_categories.json
  def create
    @product_category = ProductCategory.new(product_category_params)

    respond_to do |format|
      if @product_category.save
        format.html { redirect_to admin_product_categories_path(@product_categories), 
          notice: 'Product category was successfully created.' }
        format.json { render action: 'show', 
          status: :created, location: @product_category }
      else
        format.html { render action: 'new' }
        format.json { render json: @product_category.errors, 
          status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /product_categories/1
  # PATCH/PUT /product_categories/1.json
  def update
    respond_to do |format|
      if @product_category.update(product_category_params)
        format.html { redirect_to admin_product_category_path(@product_category), 
          notice: 'Product category was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @product_category.errors, 
          status: :unprocessable_entity }
      end
    end
  end

  # DELETE /product_categories/1
  # DELETE /product_categories/1.json
  def destroy
    @product_category.destroy
    respond_to do |format|
      format.html { redirect_to [:admin_product_categories, @product_categories] }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product_category
      @product_category = ProductCategory.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def product_category_params
      params.require(:product_category).permit(:name)
    end
end
