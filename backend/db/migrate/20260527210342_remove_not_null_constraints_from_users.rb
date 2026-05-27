class RemoveNotNullConstraintsFromUsers < ActiveRecord::Migration[7.0]
  def change
    change_column :users, :company_id, :integer, null: true
    change_column :users, :role_id, :integer, null: true
  end
end
