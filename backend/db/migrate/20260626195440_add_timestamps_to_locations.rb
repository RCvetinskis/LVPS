class AddTimestampsToLocations < ActiveRecord::Migration[7.0]
  def change
    add_timestamps :locations, null: false, default: -> { 'CURRENT_TIMESTAMP' }
  end
end
