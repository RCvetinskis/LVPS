class ApplicationController < ActionController::API
  LOCALE_TO_REGION_MAP = {
    'lt' => 'lt',
    'en' => 'gb',
    'en-US' => 'us',
    'en-GB' => 'gb',
    'fr' => 'fr',
    'de' => 'de',
    'es' => 'es',
    'pl' => 'pl',
    'ru' => 'ru',
    'lv' => 'lv',
    'ee' => 'ee',
    'fi' => 'fi',
    'se' => 'se',
    'no' => 'no',
    'dk' => 'dk'
  }.freeze

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale, :set_region

  private

  def set_locale
    locale = if current_api_v1_user&.locale.present?
               current_api_v1_user.locale

             else
               I18n.default_locale
             end

    locale = I18n.default_locale unless I18n.available_locales.include?(locale.to_sym)

    I18n.locale = locale
  end

  def set_region
    @region = LOCALE_TO_REGION_MAP[I18n.locale.to_s] || 'gb'
  end

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

  def render_success(data = nil, message = nil, status = :ok)
    response = {
      error: false,
      message: message || I18n.t('messages.success')
    }
    response[:data] = data if data
    render json: response, status: status
  end

  def render_error(message = nil, status = :unprocessable_entity)
    render json: {
      error: true,
      message: message || I18n.t('messages.error')
    }, status: status
  end

  def render_created(data = nil, message = nil)
    render_success(data, message || I18n.t('messages.success'), :created)
  end

  def render_updated(data = nil, message = nil)
    render_success(data, message || I18n.t('messages.success'), :ok)
  end

  def render_deleted(message = nil)
    render_success(nil, message || I18n.t('messages.success'), :ok)
  end

  def render_not_found(message = nil)
    render_error(message || I18n.t('messages.not_found'), :not_found)
  end

  def render_unauthorized(message = nil)
    render_error(message || 'Unauthorized', :unauthorized)
  end

  def render_forbidden(message = nil)
    render_error(message || 'Forbidden', :forbidden)
  end

  def render_dublicate(message, url, status = :conflict)
    render json: {
      error: true,
      message: message,
      url: url,
      code: 'DUPLICATE_SCHEDULE'
    }, status: status
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
      render_error(I18n.t('messages.unauthorized'), 403)
      return false
    end
    true
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: %i[name surname locale]
    )
  end
end
