module Api
  module V1
    module Users
      class DataController < ApplicationController
        before_action :authenticate_api_v1_user!, only: [:update]
        before_action :set_user, only: [:show]
        def show
          if @user
            render_success(serialize_resource(@user, UserSerializer))
          else
            render_error(I18n.t('user_not_found'))
          end
        end

        private

        def set_user
          @user = User.find_by(id: params[:id])
        end
      end
    end
  end
end
