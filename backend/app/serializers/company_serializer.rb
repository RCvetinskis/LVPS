class CompanySerializer < ActiveModel::Serializer
  attributes :id, :name, :location, :description
end
