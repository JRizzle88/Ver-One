Verone::Application.routes.draw do
 
namespace "admin" do
  root :to => "admin#index"
  resources :posts
  resources :products
end

resources :posts do
  resources :comments
end

  resources :orders
  resources :products
  resources :line_items
  resources :carts
  resources :list_items

  root :to => "home#index"
  devise_for :users, :controllers => {:registrations => "registrations"}
  resources :users
  get "/store/index"
  root :to => 'store#index', :as => 'store'
end