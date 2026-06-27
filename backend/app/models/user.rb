class User < ApplicationRecord
  enum status: {
    pending: 'pending',
    active: 'active',
    disabled: 'disabled'
  }
  include Devise::JWT::RevocationStrategies::JTIMatcher
  has_many :user_companies
  has_many :companies, through: :user_companies
  has_many :schedules, dependent: :destroy
  has_one :user_work_shift_pattern, class_name: 'UserWorkShiftPattern', dependent: :destroy
  has_one :pattern_company, through: :user_work_shift_pattern, source: :company
  has_many :pattern_companies, through: :user_work_shift_patterns, source: :company

  belongs_to :role, optional: true
  attr_accessor :skip_password_validation

  after_commit :create_default_work_shift_pattern, on: :create, if: :employee?

  devise :database_authenticatable, :registerable, :recoverable, :validatable, :jwt_authenticatable,
         jwt_revocation_strategy: self

  before_validation :set_guest_role, on: :create

  def can?(permission_name, company_id = nil)
    return false unless role
    return false unless role.permissions.exists?(name: permission_name)

    return companies.exists?(id: company_id) if company_id.present? && permission_name.include?('company')

    true
  end

  def can_invite_users?(company_id)
    can?('invite_users', company_id)
  end

  def can_manage_company?(company_id)
    can?('manage_company', company_id)
  end

  def can_view_company?(company_id)
    can?('view_company', company_id)
  end

  def can_manage_company_users?(company_id)
    can?('manage_company_users', company_id)
  end

  def any_company_permission?(company_id)
    return false unless company_id

    companies.exists?(id: company_id) && role.permissions.where('name LIKE ?', '%company%').exists?
  end

  def company_owner?
    role&.name == Role::COMPANY_OWNER_ROLE
  end

  def employee?
    role&.name == Role::EMPLOYEE_ROLE
  end

  def guest?
    role&.name == Role::GUEST_ROLE
  end

  private

  def create_default_work_shift_pattern
    company = companies.first
    return unless company

    default_pattern = UserWorkShiftPattern::DEFAULT_WORK_PATTERNS[:full_time]
    create_user_work_shift_pattern!(
      company: company,
      name: '5x2',
      hours: default_pattern[:hours],
      work_days: default_pattern[:work_days],
      off_days: default_pattern[:off_days],
      active: true
    )
  end

  def password_required?
    return false if skip_password_validation

    super
  end

  def set_guest_role
    return if role_id.present?

    guest_role = Role.find_by(name: Role::GUEST_ROLE)

    unless guest_role
      Rails.logger.warn("Default role #{guest_role} not found. User #{email} created without role.")

      return
    end

    self.role = guest_role
  end
end
