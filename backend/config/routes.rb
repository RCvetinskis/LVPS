Rails.application.routes.draw do
  resources :schedules
  namespace :api do
    namespace :v1 do
      devise_for :users,
                 defaults: { format: :json },
                 controllers: {
                   registrations: 'api/v1/users/registrations',
                   sessions: 'api/v1/users/sessions'
                 }

      namespace :users do
        resources :invitations, only: %i[create show] do
          member do
            patch :set_password
          end
        end

        resource :locales, only: [:update]
      end

      resources :roles

      resources :schedules do
        collection do
          get :company_schedules
          post :export_to_xlsx
        end
      end

      resources :companies do
        collection do
          get :current_user_companies
        end
        member do
          get :company_employees
        end
      end

      namespace :permissions do
        resources :company, only: [:show], param: :company_id do
        end
      end
    end
  end
end
