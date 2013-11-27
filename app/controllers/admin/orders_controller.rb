class Admin::OrdersController < ApplicationController
  before_action :set_order, only: [:show, :edit, :update, :destroy]

  layout 'dashboard'

  before_filter :authenticate_user!
  before_filter do 
      redirect_to new_user_session_path unless current_user && current_user.admin?
  end

def index
    @orders = Order.all.paginate page: params[:page],
      per_page: 10

    #respond_to do |format|
    #  format.html # index.html.erb
    #  format.xml  { render xml: @orders }
    #end
end

def edit
end

def show
end

def new
  @cart = current_cart
  @order_total = current_cart.total_price
    if @cart.line_items.empty?
      redirect_to [:admin_orders, @orders], notice: "Your cart is empty"
      return
    end
    @order = Order.new
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render xml: @order }
    end
end

def create
    @order = Order.new(params[:order].permit(:name, :address, :email, :pay_type))
    @order.add_line_items_from_cart(current_cart)
 
    respond_to do |format|
      if @order.save
        Cart.destroy(session[:cart_id])
        session[:cart_id] = nil
        format.html { redirect_to [:admin_orders, @order], 
          notice: 'Thank you for your order.' }
        format.xml  { render xml: @order, status: :created,
          location: @order }
      else
        @cart = current_cart
        format.html { render action: "new" }
        format.xml  { render xml: @order.errors,
          status: :unprocessable_entity }
     end
  end
end

def update
    #@post = Post.find(params[:id]) 
    respond_to do |format|
      if @order.update(params[:order].permit(:name, :address, :email, :pay_type))
        format.html  { redirect_to [:admin_orders, @order],
          notice: 'Order was successfully updated.' }
        format.json  { head :no_content }
      else
        format.html  { render action: "edit" }
        format.json  { render json: @order.errors,
          status: :unprocessable_entity }
      end
    end
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

end

