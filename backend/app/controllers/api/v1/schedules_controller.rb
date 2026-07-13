module Api
  module V1
    class SchedulesController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_schedule, only: %i[show update destroy]
      before_action :set_company, :set_location, only: %i[company_schedules export_to_xlsx]

      # GET /schedules
      def company_schedules
        schedules = @location.schedules

        if params[:from].present? && params[:to].present?
          from_date = Date.parse(params[:from])
          to_date = Date.parse(params[:to])
          schedules = schedules.by_range_date(from_date, to_date)
        end

        render_success(serialize_collection(schedules, ScheduleSerializer))
      end

      # GET /schedules/1
      def show
        render json: @schedule
      end

      def create
        @schedule = Schedule.new(schedule_params)

        if @schedule.save
          render_success(serialize_resource(@schedule, ScheduleSerializer),
                         create_update_message('schedules.create_success'))
        elsif @schedule.errors.any? && @schedule.conflict_url.present?
          render_dublicate(@schedule.errors.full_messages.first, @schedule.conflict_url)

        else
          render_error(@schedule.errors.full_messages.first, :unprocessable_entity)
        end
      end

      # PATCH/PUT /schedules/1
      def update
        if @schedule.update(schedule_params)

          render_success(serialize_resource(@schedule, ScheduleSerializer),
                         create_update_message('schedules.update_success'))
        else
          render_error(@schedule.errors.full_messages.first, :unprocessable_entity)
        end
      end

      # DELETE /schedules/1
      def destroy
        if @schedule.destroy
          render_deleted

        else
          render_error(@schedule.errors.full_messages.first, :unprocessable_entity)
        end
      end

      def create_monthly_schedule
        mp = monthly_schedule_params

        from = Date.parse(mp[:date_range][:from])
        to   = Date.parse(mp[:date_range][:to])
        date_range = (from.to_date..to.to_date)

        result = Services::Schedules::GenerateMonthlySchedule.call(
          mp[:company_id],
          mp[:location_id],
          mp[:user_id],
          date_range,
          @region
        )

        if result.success?

          if result.payload&.any?
            render_created(serialize_collection(result.payload, ScheduleSerializer))
          else
            render_error(result.error)
          end
        else
          render_error(result.error)

        end
      end

      def destroy_schedules
        mp = monthly_schedule_params

        from = Date.parse(mp[:date_range][:from])
        to   = Date.parse(mp[:date_range][:to])

        company = Company.find_by(id: mp[:company_id])
        return render_not_found(I18n.t('messages.company_not_found')) unless company

        user = company.users.find_by(id: mp[:user_id])
        return render_not_found(I18n.t('messages.user_not_found')) unless user

        user_schedules = user.schedules.by_range_date(from, to)
        return render_not_found(I18n.t('messages.schedules_not_found')) if user_schedules.empty?

        destroyed = user_schedules.destroy_all
        if destroyed.all?(&:destroyed?)
          render_deleted
        else
          render_error
        end
      end

      def schedule_types
        types = Schedule::SCHEDULE_TYPES
        data =  types.map do |type|
          {
            value: type,
            label: I18n.t("schedule_types.#{type}")
          }
        end
        render_success(data)
      end

      def export_to_xlsx
        schedule_ids = params[:schedule_ids] || []
        date_range = params[:date_range]

        xlsx_data = Services::Schedules::ExportScheduleToXlsx.call(
          @company,
          @location,
          schedule_ids,
          date_range,
          locale
        )

        send_data(
          xlsx_data,
          filename: 'schedule.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      end

      private

      def set_schedule
        schedule = Schedule.find_by(id: params[:id])

        unless schedule
          render_not_found
          return
        end
        @schedule = schedule
      end

      def set_company
        company_id = params[:company_id] || schedule_params[:company_id]
        company = current_api_v1_user.companies.find_by(id: company_id)

        unless company
          render_not_found(I18n.t('messages.company_not_found'))
          return
        end
        @company = company
      end

      def set_location
        location_id = params[:location_id] || schedule_params[:location_id]

        location = @company.locations.find_by(id: location_id)
        unless location
          render_not_found
          return
        end
        @location = location
      end

      def schedule_params
        params.require(:schedule).permit(:company_id, :user_id, :location_id, :work_date, :start_time, :end_time,
                                         :schedule_type)
      end

      def monthly_schedule_params
        params.require(:monthly_schedule).permit(:company_id, :location_id, :user_id, date_range: %i[from to])
      end

      def create_update_message(translation_name)
        I18n.t(
          translation_name,
          user_name: @schedule.user&.name,
          work_date: @schedule.work_date
        )
      end
    end
  end
end
