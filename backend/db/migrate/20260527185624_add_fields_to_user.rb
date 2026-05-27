class AddFieldsToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :name, :string, null: false
    add_column :users, :surname, :string, null: false
    add_column :users, :address, :string
    add_column :users, :birth_date, :date
  end
end
