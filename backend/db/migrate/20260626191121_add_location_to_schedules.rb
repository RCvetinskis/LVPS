class AddLocationToSchedules < ActiveRecord::Migration[7.0]
  def change
    add_reference :schedules, :location, foreign_key: true, null: true
    add_index :schedules, %i[user_id work_date location_id],
              name: 'index_schedules_on_user_work_date_location'
  end
end
