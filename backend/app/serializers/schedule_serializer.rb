class ScheduleSerializer < ActiveModel::Serializer
  attributes :id, :work_date, :start_time, :end_time, :user_data, :status, :company_id, :hours_worked

  def user_data
    {
      name: object.user.name,
      surname: object.user.surname,
      id: object.user.id
    }
  end

  def start_time
    return unless object.start_time

    object.start_time.in_time_zone(Time.zone.name).strftime('%H:%M')
  end

  def end_time
    return unless object.end_time

    object.end_time.in_time_zone(Time.zone.name).strftime('%H:%M')
  end

  def hours_worked
    return unless object.hours_worked

    total_minutes = (object.hours_worked * 60).round
    hours = total_minutes / 60
    minutes = total_minutes % 60

    format('%d:%02d', hours, minutes)
  end
end
