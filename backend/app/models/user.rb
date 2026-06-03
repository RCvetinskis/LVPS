class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  has_many :user_companies
  has_many :companies, through: :user_companies
  belongs_to :role, optional: true

  devise :database_authenticatable, :registerable, :recoverable, :validatable, :jwt_authenticatable,
         jwt_revocation_strategy: self

  before_validation :set_guest_role, on: :create

  private

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
