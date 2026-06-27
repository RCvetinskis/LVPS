class DuplicateScheduleError < StandardError
  attr_reader :url, :schedule_id, :work_date

  def initialize(message, url:, schedule_id:, work_date:)
    super(message)
    @url = url
    @schedule_id = schedule_id
    @work_date = work_date
  end
end
