class CreateSchedules < ActiveRecord::Migration[7.0]
  def change
    create_table :schedules do |t|
      t.references :company, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.date :work_date, null: false
      t.time :start_time, null: false
      t.time :end_time, null: false
      t.decimal :hours_worked, precision: 5, scale: 2
      t.string :status
      t.text :notes

      t.timestamps

      t.index %i[company_id user_id work_date]
      t.index %i[work_date start_time end_time]
      t.index %i[user_id status]
      t.index [:work_date]
    end
  end
end
