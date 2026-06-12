class ChangeTimeToDatetimeInSchedules < ActiveRecord::Migration[7.0]
  def up
    # Add new datetime columns
    add_column :schedules, :start_datetime, :datetime
    add_column :schedules, :end_datetime, :datetime
    
    # Migrate existing data
    Schedule.find_each do |schedule|
      schedule.update_columns(
        start_datetime: DateTime.parse("#{schedule.work_date} #{schedule.start_time.strftime('%H:%M:%S')}"),
        end_datetime: DateTime.parse("#{schedule.work_date} #{schedule.end_time.strftime('%H:%M:%S')}")
      )
    end
    
    # Remove old columns
    remove_column :schedules, :start_time
    remove_column :schedules, :end_time
    
    # Rename new columns
    rename_column :schedules, :start_datetime, :start_time
    rename_column :schedules, :end_datetime, :end_time
  end

  def down
    # Revert changes if needed
    add_column :schedules, :start_time_old, :time
    add_column :schedules, :end_time_old, :time
    
    Schedule.find_each do |schedule|
      schedule.update_columns(
        start_time_old: schedule.start_time.strftime('%H:%M:%S'),
        end_time_old: schedule.end_time.strftime('%H:%M:%S')
      )
    end
    
    remove_column :schedules, :start_time
    remove_column :schedules, :end_time
    rename_column :schedules, :start_time_old, :start_time
    rename_column :schedules, :end_time_old, :end_time
  end
end