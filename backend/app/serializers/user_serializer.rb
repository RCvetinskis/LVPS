class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :surname
end
