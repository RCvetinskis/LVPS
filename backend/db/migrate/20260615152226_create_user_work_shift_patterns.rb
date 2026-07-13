class CreateUserWorkShiftPatterns < ActiveRecord::Migration[7.0]
  def change
    create_table :user_work_shift_patterns do |t|
      t.references :company, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :hours, null: false
      t.integer :work_days, null: false
      t.integer :off_days, null: false
      t.boolean :active, default: true, null: false

      t.timestamps
    end
    add_index :user_work_shift_patterns, %i[company_id user_id name], unique: true,
                                                                      name: 'idx_user_shift_pattern_unique'
  end
end
