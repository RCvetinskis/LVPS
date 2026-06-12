require "test_helper"

class SchedulesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @schedule = schedules(:one)
  end

  test "should get index" do
    get schedules_url, as: :json
    assert_response :success
  end

  test "should create schedule" do
    assert_difference("Schedule.count") do
      post schedules_url, params: { schedule: { company_id: @schedule.company_id, day_of_week: @schedule.day_of_week, end_time: @schedule.end_time, start_time: @schedule.start_time, user_id: @schedule.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show schedule" do
    get schedule_url(@schedule), as: :json
    assert_response :success
  end

  test "should update schedule" do
    patch schedule_url(@schedule), params: { schedule: { company_id: @schedule.company_id, day_of_week: @schedule.day_of_week, end_time: @schedule.end_time, start_time: @schedule.start_time, user_id: @schedule.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy schedule" do
    assert_difference("Schedule.count", -1) do
      delete schedule_url(@schedule), as: :json
    end

    assert_response :no_content
  end
end
