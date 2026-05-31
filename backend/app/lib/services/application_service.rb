module Services
  class ApplicationService
    def self.call(...)
      new(...).call
    end

    def handle_success(payload = nil)
      OpenStruct.new({ success?: true, payload: payload })
    end

    def handle_error(error = I18n.t(:error))
      OpenStruct.new({ success?: false, error: error })
    end
  end
end
