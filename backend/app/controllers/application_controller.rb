class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def pagination_dict(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value

    }
  end

  def per_page(default: 10, max: 100)
    value = params[:per_page].to_i
    value = default if value <= 0
    [value, max].min
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: %i[name surname]
    )
  end
end
