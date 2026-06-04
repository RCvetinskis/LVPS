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

      namespace :users do
        resources :invitations, only: [:create]
      end

      resources :roles

      resources :companies do
        collection do
          get :current_user_companies
        end
        member do
          get :company_employees
        end
      end
    end
  end
end
