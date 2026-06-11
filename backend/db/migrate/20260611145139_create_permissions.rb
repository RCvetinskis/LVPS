class CreatePermissions < ActiveRecord::Migration[7.0]
  def change
    create_table :permissions do |t|
      t.string :name, null: false
      t.string :resource_type
      t.string :action, null: false
      t.text :description
      t.timestamps
    end

    add_index :permissions, :name, unique: true
    add_index :permissions, %i[resource_type action]
  end
end
