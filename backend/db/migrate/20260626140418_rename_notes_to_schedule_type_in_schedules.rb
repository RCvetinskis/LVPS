class RenameNotesToScheduleTypeInSchedules < ActiveRecord::Migration[7.0]
  def change
    rename_column :schedules, :notes, :schedule_type
    change_column_default :schedules, :schedule_type, 'work_day'
  end
end
