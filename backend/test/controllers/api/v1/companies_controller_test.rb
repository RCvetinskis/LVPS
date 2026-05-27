require 'test_helper'

module Api
  module V1
    class CompaniesControllerTest < ActionDispatch::IntegrationTest
      setup do
        @company = companies(:one)
      end

      test 'should get index' do
        get companies_url, as: :json
        assert_response :success
      end

      test 'should create company' do
        assert_difference('Company.count') do
          post companies_url,
               params: { company: { description: @company.description, location: @company.location, name: @company.name } }, as: :json
        end

        assert_response :created
      end

      test 'should show company' do
        get company_url(@company), as: :json
        assert_response :success
      end

      test 'should update company' do
        patch company_url(@company),
              params: { company: { description: @company.description, location: @company.location, name: @company.name } }, as: :json
        assert_response :success
      end

      test 'should destroy company' do
        assert_difference('Company.count', -1) do
          delete company_url(@company), as: :json
        end

        assert_response :no_content
      end
    end
  end
end
