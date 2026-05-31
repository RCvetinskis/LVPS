class Role < ApplicationRecord
  GUEST_ROLE = 'guest'.freeze
  COMPANY_OWNER_ROLE = 'company_owner'.freeze
  has_many :users
  
end
