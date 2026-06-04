module Api
  module V1
    module Users
      class InvitationsController < ApplicationController
        before_action :authenticate_api_v1_user!, only: [:create]
        before_action :set_user, only: [:create]

        def create
          # TODO: add inviation mailer to user
          ActiveRecord::Base.transaction do
            if @user.save
              result = Services::Companies::AssignUserRoleAndCompany.call(
                invitation_params[:company_id],
                @user,
                Role::EMPLOYEE_ROLE
              )

              if result.success?
                render_success(
                  UserSerializer.new(@user).as_json,
                  "Invitation sent to #{@user.email}"
                )
              else
                render_error(result.error)
              end
            else
              render_error(@user.errors.full_messages.to_sentence)
            end
          end
        end

        private

        def set_user
          temporary_password = Devise.friendly_token.first(12)
          @user = User.new(
            email: invitation_params[:email],
            name: invitation_params[:name],
            surname: invitation_params[:surname],
            password: temporary_password,
            password_confirmation: temporary_password
          )
        end

        def invitation_params
          params.require(:user).permit(:email, :name, :surname, :role_id, :company_id)
        end
      end
    end
  end
end
