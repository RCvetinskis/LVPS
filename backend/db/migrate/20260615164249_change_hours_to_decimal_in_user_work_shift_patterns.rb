class ChangeHoursToDecimalInUserWorkShiftPatterns < ActiveRecord::Migration[7.0]
  def up
    change_column :user_work_shift_patterns, :hours, :decimal, precision: 5, scale: 2, null: false
  end

  def down
    change_column :user_work_shift_patterns, :hours, :integer, null: false
  end
end
