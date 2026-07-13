class Location < ApplicationRecord
  belongs_to :company
  has_many :schedules, dependent: :destroy

  validates :name, presence: true
  validates :address, presence: true
  validates :company_id, presence: true
  validates :name, uniqueness: { scope: :company_id, case_sensitive: false }

  validate :only_one_primary_location, if: :primary_location?

  before_destroy :reassign_primary_location_if_deleted

  scope :active, -> { where(active: true) }
  scope :for_company, ->(company) { where(company_id: company.id) }
  scope :primary_location, -> { where(primary_location: true) }

  private

  def reassign_primary_location_if_deleted
    return unless primary_location? && company_id.present?

    other_location = company.locations.where.not(id: id).first
    return unless other_location

    other_location.update(primary_location: true)
  end

  def only_one_primary_location
    return unless primary_location?

    existing_primary = Location.where(company_id: company_id, primary_location: true)
                               .where.not(id: id)

    return unless existing_primary.exists?

    errors.add(:base, I18n.t('activerecord.errors.models.location.attributes.primary_location.already_exists'))
  end
end
