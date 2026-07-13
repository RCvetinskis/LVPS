module Api
  module V1
    module Users
      class DataController < ApplicationController
        before_action :authenticate_api_v1_user!, only: [:update]
        before_action :set_user, only: %i[show update]
        def show
          if @user
            render_success(serialize_resource(@user, UserSerializer))
          else
            render_error(I18n.t('user_not_found'))
          end
        end

        def update
          return unless authorize!('manage_company_users', params[:company_id])

          if @user.update(user_params)
            render_updated(serialize_resource(@user, UserSerializer))

          else
            render_error(@user.errors.full_messages.first, :unprocessable_entity)

          end
        end

        private

        def set_user
          @user = User.find_by(id: params[:id])
        end

        def user_params
          params.require(:user).permit(:name, :surname)
        end
      end
    end
  end
end
