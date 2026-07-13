module Api
  module V1
    class UserWorkShiftPatternsController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_user, only: %i[show upsert]

      def show
        user_work_shift_pattern = @user.user_work_shift_pattern

        if user_work_shift_pattern.present?
          render_success(user_work_shift_pattern)
        else
          render_not_found
        end
      end

      def upsert
        return unless authorize!('manage_company_users', pattern_params[:company_id])

        pattern = @user.user_work_shift_pattern

        if pattern.present?

          if pattern.update(pattern_params)
            render_success(pattern)
          else
            render_error(pattern.errors.full_messages.first)
          end
        else

          pattern = UserWorkShiftPattern.new(pattern_params)

          if pattern.save
            render_created(pattern)
          else
            render_error(pattern.errors.full_messages.first)
          end
        end
      end

      private

      def pattern_params
        params.require(:user_work_shift_pattern).permit(
          :company_id,
          :user_id,
          :name,
          :hours,
          :work_days,
          :off_days
        )
      end

      def set_user
        @user = User.find(params[:user_id] || pattern_params[:user_id])
      rescue ActiveRecord::RecordNotFound
        render_not_found('User not found')
      end
    end
  end
end
