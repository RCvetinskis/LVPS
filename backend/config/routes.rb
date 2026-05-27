Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :roles
      resources :companies
      resources :groups
    end
  end
  devise_for :users
end
