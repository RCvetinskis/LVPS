module Api
  module V1
    module Users
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        def create
          build_resource(sign_up_params)

          if resource.save

            serialized_item = ActiveModelSerializers::SerializableResource.new(
              resource,
              serializer: UserSerializer
            ).as_json

            render json: {
              error: false,
              message: 'Signed up successfully. Please login.',
              data: {
                user: serialized_item
              }
            }, status: :ok
          else
            render json: {
              error: true,
              message: resource.errors.full_messages.to_sentence
            }, status: :unprocessable_entity
          end
        end

        private

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name, :surname)
        end
      end
    end
  end
end
