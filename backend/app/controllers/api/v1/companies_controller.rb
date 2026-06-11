module Api
  module V1
    class CompaniesController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_company, only: %i[show update destroy company_employees]

      # GET /companies/1
      def show
        render json: { data: serialize_resource(@company, CompanySerializer) }
      end

      # POST /companies
      def create
        @company = Company.new(company_params)

        if @company.save
          result = Services::Companies::AssignUserRoleAndCompany.call(@company.id, current_api_v1_user, Role::COMPANY_OWNER_ROLE)

          if result.success?
            render_created(
              @company,
              message: I18n.t('messages.success')
            )
          else
            render_error(result.error)
          end
        else
          render_error(@company.errors)

        end
      end

      # PATCH/PUT /companies/1
      def update
        return unless authorize!('update_company', @company.id)

        if @company.update(company_params)
          render json: { data: @company, message: I18n.t('messages.success') }
        else
          render json: { error: @company.errors }, status: :unprocessable_entity
        end
      end

      # DELETE /companies/1
      def destroy
        return unless authorize!('delete_company', @company.id)

        @company.destroy
      end

      def current_user_companies
        companies = current_api_v1_user.companies
                                       .order(created_at: :desc)
                                       .page(params[:page])
                                       .per(per_page)

        render json: { data: serialize_collection(companies, CompanySerializer), meta: pagination_dict(companies) }
      end

      def company_employees
        render_success(serialize_collection(@company.users, UserSerializer))
      end

      private

      def set_company
        @company = UserCompany.find_by(company_id: params[:id], user_id: current_api_v1_user.id).company
      end

      def company_params
        params.require(:company).permit(:name, :location, :description)
      end
    end
  end
end
