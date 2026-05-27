class Company < ApplicationRecord
  has_many :users

  def employees_count
    users.count
  end
end
