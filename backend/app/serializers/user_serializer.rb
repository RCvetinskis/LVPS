class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :surname, :created_at, :role, :status, :invitation_token, :locale

  def created_at
    I18n.l(object.created_at, format: :default)
  end

  def role
    object.role.name
  end

  def status
    I18n.t("activerecord.attributes.user.statuses.#{object.status}", default: object.status)
  end
end
