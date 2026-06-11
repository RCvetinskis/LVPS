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

  def render_success(data = nil, message = 'Success', status = :ok)
    response = { error: false, message: message }
    response[:data] = data if data
    render json: response, status: status
  end

  def render_error(message = 'Error', status = :unprocessable_entity)
    render json: { error: true, message: message }, status: status
  end

  def render_created(data = nil, message = 'Created successfully')
    render_success(data, message, :created)
  end

  def render_updated(data = nil, message = 'Updated successfully')
    render_success(data, message, :ok)
  end

  def render_deleted(message = 'Deleted successfully')
    render_success(nil, message, :ok)
  end

  def serialize_collection(collection, serializer)
    ActiveModelSerializers::SerializableResource.new(
      collection,
      each_serializer: serializer
    ).as_json
  end

  def serialize_resource(resource, serializer)
    ActiveModelSerializers::SerializableResource.new(
      resource,
      serializer: serializer
    ).as_json
  end

  def authorize!(permission_name, resource_id = nil)
    unless current_api_v1_user.can?(permission_name, resource_id)
      render_error('You are not authorized to perform this action', 403)
      return false
    end
    true
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: %i[name surname]
    )
  end
end
