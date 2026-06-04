class Role < ApplicationRecord
  GUEST_ROLE = 'guest'.freeze
  COMPANY_OWNER_ROLE = 'company_owner'.freeze
  EMPLOYEE_ROLE = 'employee'.freeze
  has_many :users
  
end
