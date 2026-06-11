# app/services/companies/authorize_company_action.rb
module Services
  module Companies
    class AuthorizeCompanyAction < ApplicationService
      def initialize(current_user, company_id)
        super()
        @current_user = current_user
        @company_id = company_id
      end

      def call
        authorize!
      end

      private

      def authorize!
        unless @current_user&.role&.name == Role::COMPANY_OWNER_ROLE &&
               @current_user.companies.exists?(id: @company_id)
          return handle_error('Only company owners can perform this action on their company', 403)
        end

        handle_success
      end
    end
  end
end
