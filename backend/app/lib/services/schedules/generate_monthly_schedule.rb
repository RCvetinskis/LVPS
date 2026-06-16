module Services
  module Schedules
    class GenerateMonthlySchedule < ApplicationService
      def initialize(company_id, user_id, date_range, region = 'gb')
        super()
        @company_id = company_id
        @user_id = user_id
        @date_range = date_range
        @region = region
      end

      def call
        schedules = generate_work_days
        handle_success(schedules)
      rescue ActiveRecord::RecordInvalid => e
        handle_error(e.message)
      end

      private

      attr_reader :company_id, :user_id, :date_range, :region

      def pattern
        @pattern ||= UserWorkShiftPattern.for_user(user_id)
      end

      def rotating_shift?
        # TODO: DEFINE SHIFTS IN MODEL, CREATE COMPANY SHIFT SHAMBLONS, COMPANY.USERWORKSHIFTPATERNS and in frondend ui u can set as default for each
        %w[rotating_shift slenkantis].include?(pattern.name&.downcase)
      end

      def standard_5x2?
        pattern.work_days == 5 && pattern.off_days == 2 && !rotating_shift?
      end

      def holidays
        @holidays ||= begin
          data = Holidays.cache_between(date_range.begin, date_range.end, region)
          return [] unless data.is_a?(Hash)

          data.flat_map do |_date, list|
            list.map { |h| { date: h[:date], name: h[:name], regions: h[:regions] } }
          end
        end
      end

      def holiday?(date)
        holidays.any? { |h| h[:date] == date }
      end

      def day_before_holiday?(date)
        holiday?(date + 1.day)
      end

      def hours_for_date(date)
        return 0 if standard_5x2? && holiday?(date)
        return 0 if standard_5x2? && !date.on_weekday?

        base = pattern.hours
        day_before_holiday?(date) ? base - 1 : base
      end

      def existing_schedules
        @existing_schedules ||= Schedule.where(
          company_id: company_id,
          work_date: date_range.begin..date_range.end
        ).to_a
      end

      def worker_count_by_date
        @worker_count_by_date ||= existing_schedules.each_with_object(Hash.new(0)) do |s, h|
          h[s.work_date] += 1
        end
      end

      def user_already_scheduled?(date)
        existing_schedules.any? { |s| s.user_id == user_id && s.work_date == date }
      end

      def monthly_hour_limit
        return @monthly_hour_limit if defined?(@monthly_hour_limit)

        total_hours = 0
        (date_range.begin..date_range.end).each do |date|
          next unless in_work_cycle?(date)
          next if standard_5x2? && holiday?(date)

          total_hours += pattern.hours
        end

        unless standard_5x2?
          holidays.each do |_holiday|
            total_hours -= pattern.hours
          end
        end

        @monthly_hour_limit = [total_hours, 0].max
      end

      def build_expected_calendar
        (date_range.begin..date_range.end).map do |date|
          next if in_work_cycle?(date) == false
          next if standard_5x2? && holiday?(date)

          {
            date: date,
            hours: hours_for_date(date)
          }
        end.compact
      end

      def build_available_days
        (date_range.begin..date_range.end).select do |date|
          next false if standard_5x2? && holiday?(date) # Only standard_5x2 skips holidays
          next false if user_already_scheduled?(date)
          next false if standard_5x2? && !date.on_weekday? # Standard_5x2 only weekdays
          next false unless in_work_cycle?(date)

          true
        end
      end

      def prioritize_days(days)
        days.sort_by do |date|
          [
            worker_count_by_date[date].to_i,  # Priority 1: Fill unscheduled/least scheduled days
            pattern_score(date),              # Priority 2: Respect shift structure
            (date - date_range.begin).to_i    # Priority 3: Stable ordering
          ]
        end
      end

      def pattern_score(date)
        if standard_5x2?
          date.on_weekday? ? 0 : 10
        else
          cycle = pattern.work_days + pattern.off_days
          index = (date - date_range.begin).to_i % cycle
          index < pattern.work_days ? 0 : 5
        end
      end

      def cycle_offset
        @cycle_offset ||= user_id.hash % (pattern.work_days + pattern.off_days)
      end

      def in_work_cycle?(date)
        # Standard 5x2 works Monday-Friday only
        return date.on_weekday? if standard_5x2?

        # Rotating shifts use cycle calculation
        cycle = pattern.work_days + pattern.off_days
        index = ((date - date_range.begin).to_i + cycle_offset) % cycle

        index < pattern.work_days
      end

      def generate_work_days
        return [] unless pattern

        available_days = build_available_days
        return [] if available_days.empty?

        # Sort by priority: least scheduled first
        prioritized_days = prioritize_days(available_days)

        total_scheduled_hours = 0
        scheduled_dates = []

        # Schedule days while respecting hour limit
        prioritized_days.each do |date|
          hours = hours_for_date(date)

          if total_scheduled_hours + hours > monthly_hour_limit
            remaining_hours = monthly_hour_limit - total_scheduled_hours
            break if remaining_hours <= 0

            break
          end

          next if user_already_scheduled?(date)

          # Only standard_5x2 can't work holidays
          # Rotating shifts CAN work holidays
          next if holiday?(date) && standard_5x2?

          create_schedule(date, hours)
          total_scheduled_hours += hours
          scheduled_dates << date
        end

        # If we haven't filled enough hours, try to add more days from the plan
        if total_scheduled_hours < monthly_hour_limit && !standard_5x2?
          fill_remaining_hours(prioritized_days, scheduled_dates, total_scheduled_hours)
        end

        Schedule.where(
          company_id: company_id,
          user_id: user_id,
          work_date: date_range.begin..date_range.end
        )
      end

      def fill_remaining_hours(prioritized_days, scheduled_dates, current_hours)
        remaining_hours = monthly_hour_limit - current_hours
        unscheduled = prioritized_days.reject { |d| scheduled_dates.include?(d) }

        unscheduled.each do |date|
          break if remaining_hours <= 0

          hours = hours_for_date(date)
          hours_to_assign = [hours, remaining_hours].min

          next if user_already_scheduled?(date)

          create_schedule(date, hours_to_assign)
          remaining_hours -= hours_to_assign
        end
      end

      def create_schedule(date, hours)
        # TODO: ADD FOR COMPANY/USERWORKSHIFT COMPANY_STAR_HOUR EX: USERWORKSFITPATERN.STARTING_HOUR || COMPANY.STARTING_HOUR
        start_time = Time.zone.parse("#{date} 10:00")
        end_time = start_time + hours.hours

        Schedule.create!(
          company_id: company_id,
          user_id: user_id,
          work_date: date,
          start_time: start_time,
          end_time: end_time
        )
      end
    end
  end
end
