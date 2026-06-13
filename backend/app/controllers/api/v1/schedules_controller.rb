module Api
  module V1
    class SchedulesController < ApplicationController
      before_action :set_schedule, only: %i[show update destroy]
      before_action :set_company, only: %i[company_schedules]

      # GET /schedules
      def company_schedules
        schedules = @company.schedules

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
          render_success(serialize_resource(@schedule, ScheduleSerializer))
        else
          render_error(@schedule.errors.full_messages.first, :unprocessable_entity)
        end
      end

      # PATCH/PUT /schedules/1
      def update
        if @schedule.update(schedule_params)
          render json: @schedule
        else
          render json: @schedule.errors, status: :unprocessable_entity
        end
      end

      # DELETE /schedules/1
      def destroy
        @schedule.destroy
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_schedule
        @schedule = Schedule.find(params[:id])
      end

      def set_company
        @company = current_api_v1_user.companies.find_by(id: params[:company_id])
      end

      # Only allow a list of trusted parameters through.
      def schedule_params
        params.require(:schedule).permit(:company_id, :user_id, :work_date, :start_time, :end_time)
      end
    end
  end
end
