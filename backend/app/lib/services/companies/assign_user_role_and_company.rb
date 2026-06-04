module Services
  module Companies
    class AssignUserRoleAndCompany < ApplicationService
      def initialize(company_id, user, role_name)
        super()
        @company_id = company_id
        @user = user
        @role_name = role_name
      end

      def call
        assign_company_and_role
      end

      private

      def assign_company_and_role
        return handle_error(I18n.t('messages.user_not_found')) unless @user

        role = Role.find_by(name: @role_name)

        return handle_error("Role named(#{@role_name}) not found") unless role

        ActiveRecord::Base.transaction do
          UserCompany.create!(
            user_id: @user.id,
            company_id: @company_id
          )

          @user.update!(role_id: role.id)
        end

        handle_success
      rescue ActiveRecord::RecordInvalid => e
        handle_error(e.message)
      end
    end
  end
end
