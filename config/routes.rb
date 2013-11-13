Verone::Application.routes.draw do
  resources :line_items

  resources :carts
  resources :list_items
  
  get "store/index"
  resources :products

  root :to => "home#index"
  devise_for :users, :controllers => {:registrations => "registrations"}
  resources :users

  root to: 'store#index', as: 'store'
end