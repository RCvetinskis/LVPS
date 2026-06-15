module Api
  module V1
    module Users
      class LocalesController < ApplicationController
        before_action :authenticate_api_v1_user!, only: [:update]

        def update
          user = current_api_v1_user
          if user.update(locale: params[:locale])
            render_success(user.locale)
          else
            render_error(user.errors.full_messages.first || I18n.t('messages.error'))
          end
        end
      end
    end
  end
end
