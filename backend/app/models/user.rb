class User < ApplicationRecord
  belongs_to :company, optional: true
  belongs_to :role, optional: true

  devise :database_authenticatable, :registerable, :recoverable, :validatable, :jwt_authenticatable,
         jwt_revocation_strategy: self
end
