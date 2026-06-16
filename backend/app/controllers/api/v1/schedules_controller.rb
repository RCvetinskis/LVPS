module Api
  module V1
    class SchedulesController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_schedule, only: %i[show update destroy]
      before_action :set_company, only: %i[company_schedules export_to_xlsx]

      # GET /schedules
      def company_schedules
        schedules = @company.schedules
        from_date = params[:from]
        to_date = params[:to]

        schedules = schedules.by_range_date(from_date, to_date) if from_date.present? && to_date.present?

        render_success(serialize_collection(schedules, ScheduleSerializer))
      end

      # GET /schedules/1
      def show
        render json: @schedule
      end

      # POST /schedules
      def create
        @schedule = Schedule.new(schedule_params)

        if @schedule.save
          render_success(serialize_resource(@schedule, ScheduleSerializer),
                         create_update_message('schedules.create_success'))
        else
          render_error(@schedule.errors.full_messages.first, :unprocessable_entity)
        end
      end

      # TODO: DESTROY_ALL_MONTHLY_SCHEDULES_FOR_USER
      def create_monthly_schedule
        mp = monthly_schedule_params

        from = Date.parse(mp[:date_range][:from])
        to   = Date.parse(mp[:date_range][:to])
        date_range = (from.to_date..to.to_date)

        result = Services::Schedules::GenerateMonthlySchedule.call(
          mp[:company_id],
          mp[:user_id],
          date_range,
          @region
        )

        if result.success?

          if result.payload&.any?
            render_created(serialize_collection(result.payload, ScheduleSerializer))
          else
            render json: {
              message: 'No schedules were created',
              schedules: []
            }, status: :ok
          end
        else
          render_error(result.error)

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

      def export_to_xlsx
        schedule_ids = params[:schedule_ids] || []
        date_range = params[:date_range]

        xlsx_data = Services::Schedules::ExportScheduleToXlsx.call(
          @company,
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

      # Use callbacks to share common setup or constraints between actions.
      def set_schedule
        @schedule = Schedule.find(params[:id])
      end

      def set_company
        @company = current_api_v1_user.companies.find_by(id: params[:company_id])
      end

      def schedule_params
        params.require(:schedule).permit(:company_id, :user_id, :work_date, :start_time, :end_time, :notes)
      end

      def monthly_schedule_params
        params.require(:monthly_schedule).permit(:company_id, :user_id, date_range: %i[from to])
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
