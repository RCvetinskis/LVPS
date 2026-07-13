module Api
  module V1
    class LocationsController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_company, only: %i[index create show update]
      before_action :set_location, only: %i[show update]

      def index
        locations = @company.locations
                            .order(created_at: :desc)
                            .page(params[:page])
                            .per(per_page)

        render json: { data: locations, meta: pagination_dict(locations) }
      end

      def show
        render_success(@location)
      end

      def create
        location = nil

        Location.transaction do
          location = Location.new(location_params)

          location.primary_location = true if location.company.locations.count == 0

          # If setting as primary, unset others
          if location.primary_location?
            Location.where(company_id: location.company_id, primary_location: true)
                    .update_all(primary_location: false)
          end

          location.save!
        end

        render_created(location)
      rescue ActiveRecord::RecordInvalid => e
        render_error(e.record.errors.full_messages.first)
      end

      def update
        if @location.update(location_params)
          render_updated(@location)
        else
          render_error(@location.errors.full_messages.first, :unprocessable_entity)
        end
      end

      private

      def set_company
        company_id = params[:company_id] || location_params[:company_id]

        user_company = UserCompany.find_by(
          company_id: company_id,
          user_id: current_api_v1_user.id
        )

        unless user_company
          render_not_found
          return
        end

        @company = user_company.company
      end

      def set_location
        location = @company.locations.find_by(id: params[:id])

        unless location
          render_not_found
          return
        end

        @location = location
      end

      def location_params
        params.require(:location).permit(:company_id, :name, :address, :city, :country, :postal_code, :phone, :email,
                                         :notes, :active, :primary_location)
      end
    end
  end
end
