# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      devise_for :users, 
        defaults: { format: :json },
        controllers: {
          registrations: 'api/v1/users/registrations',
          sessions: 'api/v1/users/sessions'
        }

      resources :roles
      resources :companies
      resources :groups
    end
  end
end