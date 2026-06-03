module Api
  module V1
    class CompaniesController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_company, only: %i[show update destroy]

      def current_user_companies
        companies = current_api_v1_user.companies
                                       .order(created_at: :desc)
                                       .page(params[:page])
                                       .per(per_page)

        serialized_companies = ActiveModelSerializers::SerializableResource.new(
          companies,
          each_serializer: CompanySerializer
        ).as_json

        render json: { data: serialized_companies, meta: pagination_dict(companies) }
      end

      # GET /companies/1
      def show
        serialized_item = ActiveModelSerializers::SerializableResource.new(
          @company,
          serializer: CompanySerializer
        ).as_json

        render json: { data: serialized_item }
      end

      # POST /companies
      def create
        @company = Company.new(company_params)

        if @company.save
          result = Services::Companies::AssignCompanyOwner.call(@company, current_api_v1_user)

          if result.success?
            render json: { data: @company, message: I18n.t('messages.success') }, status: :created
          else
            render json: { error: result.error }, status: :unprocessable_entity
          end
        else
          render json: { error: @company.errors }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /companies/1
      def update
        if @company.update(company_params)
          render json: { data: @company, message: I18n.t('messages.success') }
        else
          render json: { error: @company.errors }, status: :unprocessable_entity
        end
      end

      # DELETE /companies/1
      def destroy
        @company.destroy
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_company
        @company = Company.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def company_params
        params.require(:company).permit(:name, :location, :description)
      end
    end
  end
end
