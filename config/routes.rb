Verone::Application.routes.draw do

  resources :post_categories

  resources :product_categories

  devise_for :users, :controllers => {:registrations => "registrations"}
  devise_for :admins

get '/token' => 'home#token', as: :token

namespace "admin" do |admin|
  get 'dashboard' => 'dashboard#index'
  root :to => "dashboard#index"
  resources :admin
  resources :posts
  resources :products
  resources :users
  resources :orders
  resources :post_categories
  resources :product_categories
end

  root :to => "home#index"
  resources :posts do
    resources :comments
  end

  get "/store/index"
  resources :products
  resources :line_items
  resources :orders
  resources :carts
  resources :list_items  
  resources :stores, as: 'store'
  
  #get "/store/index"
  
end