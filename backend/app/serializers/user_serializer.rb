class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :surname, :created_at, :role

  def created_at
    I18n.l(object.created_at, format: :default)
  end

  def role
    object.role.name
  end
end
