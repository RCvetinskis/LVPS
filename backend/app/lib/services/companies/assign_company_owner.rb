module Services
  module Companies
    class AssignCompanyOwner < ApplicationService
      def initialize(company, current_user)
        super()
        @company = company
        @current_user = current_user
      end

      def call
        set_company_owner
      end

      private

      def set_company_owner
        return handle_error(I18n.t('messages.user_not_found')) unless @current_user

        company_owner_role = Role.find_by(name: Role::COMPANY_OWNER_ROLE)
        return handle_error('Company owner role not found') unless company_owner_role

        ActiveRecord::Base.transaction do
          UserCompany.create!(
            user: @current_user,
            company: @company
          )

          @current_user.update!(role_id: company_owner_role.id)
        end

        handle_success(@company)
      rescue ActiveRecord::RecordInvalid => e
        handle_error(e.message)
      end
    end
  end
end
