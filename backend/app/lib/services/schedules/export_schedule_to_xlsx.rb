require 'caxlsx'

module Services
  module Schedules
    class ExportScheduleToXlsx < ApplicationService
      def initialize(company, schedule_ids, range_date, locale)
        super()
        @company = company
        @schedule_ids = schedule_ids
        @range_date = range_date
        @locale = locale
      end

      def call
        I18n.with_locale(@locale) do
          generate_xlsx
        end
      end

      private

      def generate_xlsx
        package = Axlsx::Package.new

        workbook = package.workbook

        workbook.add_worksheet(name: I18n.t('export.schedule_sheet_name')) do |sheet|
          create_styles(sheet)

          total_columns = 3 + date_range.count + 2

          #
          # TITLE
          #
          sheet.add_row []
          sheet.add_row [I18n.t('export.work_schedule_title').upcase]
          sheet.merge_cells("A2:#{column_letter(total_columns)}2")
          sheet.rows.last.style = @title_style

          sheet.add_row [@company.name]
          sheet.merge_cells("A3:#{column_letter(total_columns)}3")
          sheet.rows.last.style = @title_style

          sheet.add_row [month_title]
          sheet.merge_cells("A4:#{column_letter(total_columns)}4")
          sheet.rows.last.style = @title_style

          sheet.add_row []

          #
          # HEADER ROW 1
          #
          header1 = [
            I18n.t('export.headers.id'),
            I18n.t('export.headers.employee'),
            I18n.t('export.headers.position')
          ] + date_range.map(&:day) + [
            I18n.t('export.headers.total_days'),
            I18n.t('export.headers.total_hours')
          ]

          sheet.add_row(header1)

          #
          # HEADER ROW 2
          #
          header2 = [
            '',
            '',
            ''
          ] + date_range.map { |d| weekday_short(d) } + ['', '']

          sheet.add_row(header2)

          sheet.rows[-2].style = Array.new(header1.length, @header_style)
          sheet.rows[-1].style = Array.new(header2.length, @header_style)

          #
          # EMPLOYEE DATA
          #
          users = schedules.group_by(&:user_id)

          users.each do |_user_id, user_schedules|
            user = user_schedules.first.user

            schedule_by_date =
              user_schedules.index_by(&:work_date)

            total_hours = 0
            total_days = 0

            row = [
              user.id,
              user_name(user_schedules.first),
              user.respond_to?(:position) ? user.position : ''
            ]

            date_range.each do |date|
              schedule = schedule_by_date[date]

              if schedule.present?
                row << schedule_cell(schedule)
                total_hours += worked_hours(schedule)
                total_days += 1
              else
                row << ''
              end
            end
            row << total_days
            row << total_hours.round(1)

            sheet.add_row(row)

            sheet.rows.last.style =
              Array.new(row.length, @cell_style)
          end

          #
          # SUMMARY
          #
          sheet.add_row []

          summary_row = [
            '',
            I18n.t('export.daily_totals'),
            ''
          ] + calculate_daily_totals + ['']

          sheet.add_row(summary_row)

          sheet.rows.last.style =
            Array.new(summary_row.length, @header_style)

          #
          # COLUMN WIDTHS
          #
          widths = [8, 20, 15]
          widths += Array.new(date_range.count, 7)
          widths += [14, 14]

          sheet.column_widths(*widths)
        end

        package.to_stream.read
      end

      def create_styles(sheet)
        styles = sheet.styles

        @title_style = styles.add_style(
          b: true,
          sz: 14,
          alignment: {
            horizontal: :center,
            vertical: :center
          }
        )

        @header_style = styles.add_style(
          b: true,
          border: {
            style: :thin,
            color: '000000'
          },
          alignment: {
            horizontal: :center,
            vertical: :center
          }
        )

        @cell_style = styles.add_style(
          border: {
            style: :thin,
            color: '000000'
          },
          alignment: {
            horizontal: :center,
            vertical: :center,
            wrap_text: true
          }
        )
      end

      def schedules
        @schedules ||= @company.schedules
                               .where(id: @schedule_ids)
                               .includes(:user)
      end

      def date_range
        @date_range ||= begin
          from = Date.parse(@range_date[:from])
          to = Date.parse(@range_date[:to])
          (from..to).to_a
        end
      end

      def month_title
        date = date_range.first
        "#{I18n.t('date.month_names')[date.month]} #{date.year}"
      end

      def weekday_short(date)
        I18n.t('date.abbr_day_names')[date.wday]
      end

      def schedule_cell(schedule)
        return '' unless schedule.start_time && schedule.end_time

        start_time = schedule.start_time.in_time_zone(Time.zone)
        end_time = schedule.end_time.in_time_zone(Time.zone)
        hours = worked_hours(schedule)

        "#{start_time.strftime('%H:%M')}\n#{end_time.strftime('%H:%M')}\n#{hours}h"
      end

      def worked_hours(schedule)
        return schedule.hours_worked unless schedule.hours_worked.nil?
        return 0 unless schedule.start_time && schedule.end_time

        ((schedule.end_time - schedule.start_time) / 3600).round(1)
      end

      def calculate_daily_totals
        date_range.map do |date|
          total = schedules.select { |s| s.work_date == date }
                           .sum { |s| worked_hours(s) }

          total.zero? ? '' : "#{total}h"
        end
      end

      def user_name(schedule)
        return I18n.t('export.unknown') unless schedule&.user

        "#{schedule.user.name} \n #{schedule.user.surname}".strip
      end

      def column_letter(number)
        result = ''

        while number.positive?
          number, remainder = (number - 1).divmod(26)
          result.prepend((65 + remainder).chr)
        end

        result
      end
    end
  end
end
