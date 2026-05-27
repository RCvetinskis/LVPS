module Api
  module V1
    module Users
      class SessionsController < Devise::SessionsController
        respond_to :json

        def create
          user = User.find_by(email: params[:user][:email])

          if user&.valid_password?(params[:user][:password])

            jwt_token = generate_jwt_token(user)

            serialized_item = ActiveModelSerializers::SerializableResource.new(
              user,
              serializer: UserSerializer
            ).as_json

            render json: {
              error: false,
              message: 'Logged in successfully.',
              data: {
                jwt: jwt_token,
                user: serialized_item
              }
            }, status: :ok
          else
            render json: {
              error: true,
              message: 'Invalid email or password'
            }, status: :unauthorized
          end
        end

        private

        def generate_jwt_token(user)
          payload = {
            sub: user.id,
            email: user.email,
            exp: 24.hours.from_now.to_i,
            iat: Time.now.to_i
          }

          secret = Rails.application.credentials.secret_key_base
          JWT.encode(payload, secret, 'HS256')
        end

        def respond_with(resource, _opts = {})
          # Prevent Devise default response
        end

        def respond_to_on_destroy
          # Prevent Devise default response
        end
      end
    end
  end
end
