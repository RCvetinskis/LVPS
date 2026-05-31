class CompanySerializer < ActiveModel::Serializer
  attributes :id, :name, :location, :description, :created_at

  def created_at
    I18n.l(object.created_at, format: :default)
  end

  def company_owner
    object.users.find_by
  end
end
