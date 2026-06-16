class Company < ApplicationRecord
  has_many :user_companies, dependent: :destroy
  has_many :users, through: :user_companies
  has_many :schedules, dependent: :destroy
  has_many :user_work_shift_patterns
  has_many :pattern_users, through: :user_work_shift_patterns, source: :user
end
