module Api
  module V1
    module Users
      class SessionsController < Devise::SessionsController
        respond_to :json

        def create
          self.resource = User.find_for_database_authentication(email: params[:user][:email])

          if resource&.valid_password?(params[:user][:password])
            sign_in(resource_name, resource)

            render json: {
              error: false,
              message: 'Logged in successfully',
              data: {
                jwt: request.env['warden-jwt_auth.token'],
                user: UserSerializer.new(resource).as_json
              }
            }
          else
            render json: {
              error: true,
              message: 'Invalid credentials'
            }, status: :unauthorized
          end
        end
      end
    end
  end
end
