class Role < ApplicationRecord
  has_many :role_permissions
  has_many :permissions, through: :role_permissions
  has_many :users
  GUEST_ROLE = 'guest'.freeze
  COMPANY_OWNER_ROLE = 'company_owner'.freeze
  EMPLOYEE_ROLE = 'employee'.freeze
end
