module Api
  module V1
    class HolidaysController < ApplicationController
      before_action :authenticate_api_v1_user!

      def index
        from = Date.parse(index_params[:date_range][:from])
        to = Date.parse(index_params[:date_range][:to])
        holidays = Holidays.cache_between(from, to, @region)
        formatted_holidays = format_holidays(holidays)

        render_success(formatted_holidays)
      end

      private

      def index_params
        params.permit(date_range: %i[from to])
      end

      def format_holidays(holidays)
        if holidays.is_a?(Hash)
          holidays.flat_map do |_date, holiday_list|
            holiday_list.map do |holiday|
              {
                date: holiday[:date],
                name: holiday[:name],
                regions: holiday[:regions]
              }
            end
          end

        else
          []
        end
      end
    end
  end
end
