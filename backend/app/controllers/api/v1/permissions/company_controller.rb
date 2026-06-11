module Api
  module V1
    module Permissions
      class CompanyController < ApplicationController
        before_action :authenticate_api_v1_user!

        def show
          user = current_api_v1_user
          accesses = {
            view: user.can?('view_company', params[:company_id]),
            update: user.can?('update_company', params[:company_id]),
            create: user.can?('create_company'),
            delete: user.can?('delete_company', params[:company_id]),
            manage_company_users: user.can?('manage_company_users', params[:company_id])
          }

          render_success(accesses)
        end
      end
    end
  end
end
