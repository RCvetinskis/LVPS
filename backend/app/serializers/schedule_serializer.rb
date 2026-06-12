class ScheduleSerializer < ActiveModel::Serializer
  attributes :id, :work_date, :start_time, :end_time, :user_data, :status, :company_id

  def user_data
    {
      name: object.user.name,
      surname: object.user.surname,
      id: object.user.id
    }
  end
end
