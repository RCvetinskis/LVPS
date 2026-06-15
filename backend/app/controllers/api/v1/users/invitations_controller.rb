module Api
  module V1
    module Users
      class InvitationsController < ApplicationController
        before_action :set_user, :invitation_params, :authenticate_api_v1_user!, only: [:create]

        before_action :user_by_token, only: %i[show set_password]

        def create
          return unless authorize!('manage_company_users', invitation_params[:company_id])

          ActiveRecord::Base.transaction do
            if @user.save
              result = Services::Companies::AssignUserRoleAndCompany.call(
                invitation_params[:company_id],
                @user,
                Role::EMPLOYEE_ROLE
              )

              if result.success?
                company = Company.find_by(id: invitation_params[:company_id])

                UserMailer.invitation_mail(company, @user).deliver_now
                render_success(
                  serialize_resource(@user, UserSerializer),
                  I18n.t('user.invitations.sent', @user.email)
                )
              else
                render_error(result.error)
              end
            else
              render_error(@user.errors.full_messages.first)
            end
          end
        end

        def show
          if @token_user
            render_success(serialize_resource(@token_user, UserSerializer), I18n.t('messages.user_not_found'))

          else
            render_error('user not found', 404)
          end
        end

        def set_password
          @token_user.password = set_password_params[:password]
          @token_user.status = :active

          if @token_user.save
            render_success(nil, I18n.t('success'))
          else

            render_error
          end
        end

        private

        def user_by_token
          @token_user = User.find_by(invitation_token: params[:id])
        end

        def set_user
          @user = User.new(
            email: invitation_params[:email],
            name: invitation_params[:name],
            surname: invitation_params[:surname]
          )
          @user.skip_password_validation = true
          @user.invitation_token = SecureRandom.hex(32)
          @user.invitation_sent_at = Time.current
        end

        def invitation_params
          params.require(:user).permit(:email, :name, :surname, :role_id, :company_id)
        end

        def set_password_params
          params.require(:user).permit(:password)
        end
      end
    end
  end
end
