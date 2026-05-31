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
        return handle_error('Current user not found') unless @current_user

        company_owner_role = Role.find_by(name: Role::COMPANY_OWNER_ROLE)
        return handle_error('Company owner role not found') unless company_owner_role

        if @current_user.update(
          company_id: @company.id,
          role_id: company_owner_role.id
        )
          handle_success(@company)
        else
          handle_error(@current_user.errors.full_messages.to_sentence)
        end
      end
    end
  end
end
