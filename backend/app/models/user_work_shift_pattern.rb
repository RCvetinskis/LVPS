class UserWorkShiftPattern < ApplicationRecord
  belongs_to :company
  belongs_to :user

  DEFAULT_WORK_PATTERNS = {
    full_time: { hours: 8, work_days: 5, off_days: 2 },
    part_time: { hours: 6, work_days: 5, off_days: 2 },
    half_day: { hours: 4, work_days: 5, off_days: 2 }
  }.freeze

  validates :name, presence: true
  validates :hours, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 24 }
  validates :work_days, :off_days, presence: true, numericality: { greater_than: 0 }

  scope :active, -> { where(active: true) }
  scope :for_company, ->(company) { where(company_id: company) }
  scope :for_user_in_company, ->(user, company) { where(user_id: user, company_id: company) }

  def self.for_user(user)
    find_by(user_id: user)
  end
end
