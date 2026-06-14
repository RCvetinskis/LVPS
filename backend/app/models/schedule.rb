class Schedule < ApplicationRecord
  belongs_to :company
  belongs_to :user

  STATUSES = %w[scheduled completed absent sick vacation holiday late].freeze
  HOURS_CALCULABLE_STATUSES = %w[scheduled completed].freeze
  validates :work_date, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, inclusion: { in: STATUSES }
  validate :end_time_after_start_time
  validate :unique_schedule_per_day, on: %i[create update]

  attribute :status, :string, default: 'scheduled'

  scope :upcoming, -> { where('work_date >= ?', Date.today).where(status: 'scheduled') }
  scope :past, -> { where('work_date < ?', Date.today) }
  scope :completed, -> { where(status: 'completed') }
  scope :by_date, ->(date) { where(work_date: date) }
  scope :for_user, ->(user_id) { where(user_id: user_id) }

  before_validation :combine_date_and_time

  before_save :calculate_hours_worked, if: -> { start_time.present? && end_time.present? }

  private

  def end_time_after_start_time
    return if start_time.blank? || end_time.blank?

    return unless start_time >= end_time

    errors.add(:end_time, 'must be after start time')
  end

  def calculate_hours_worked
    return unless HOURS_CALCULABLE_STATUSES.include?(status)
    return if work_date.blank? || start_time.blank? || end_time.blank?

    start_dt = start_time.is_a?(String) ? Time.zone.parse(start_time) : start_time
    end_dt = end_time.is_a?(String) ? Time.zone.parse(end_time) : end_time

    diff_seconds = (end_dt - start_dt).to_f
    diff_hours = (diff_seconds / 3600.0).round(2)

    self.hours_worked = diff_hours
  end

  def combine_date_and_time
    return if work_date.blank?

    if start_time.present? && start_time.to_date != work_date
      time_part = start_time.strftime('%H:%M:%S')
      self.start_time = DateTime.parse("#{work_date} #{time_part}")
    end

    return unless end_time.present? && end_time.to_date != work_date

    time_part = end_time.strftime('%H:%M:%S')
    self.end_time = DateTime.parse("#{work_date} #{time_part}")
  end

  def unique_schedule_per_day
    return if work_date.blank? || user_id.blank?

    query = Schedule.where(user_id: user_id, work_date: work_date)
    query = query.where.not(id: id) if persisted?

    return unless query.exists?

    errors.add(:user_id, "already has a schedule on #{work_date}")
    errors.add(:work_date, 'already has a schedule for this user')
  end
end
