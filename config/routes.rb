Verone::Application.routes.draw do
  resources :line_items
  resources :carts
  resources :list_items
  
  resources :products

  root :to => "home#index"
  devise_for :users, :controllers => {:registrations => "registrations"}
  resources :users
  get "/store/index"
  root :to => 'store#index', :as => 'store'
end