class CreateLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :locations do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name, null: false
      t.string :address
      t.string :city
      t.string :country
      t.string :postal_code
      t.string :phone
      t.string :email
      t.boolean :active, default: true
      t.boolean :primary_location, default: false
      t.text :notes
    end
    add_index :locations, %i[company_id name], unique: true
    add_index :locations, %i[company_id primary_location], unique: true, where: 'primary_location = true'
  end
end
