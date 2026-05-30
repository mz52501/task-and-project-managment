class ApplicationController < ActionController::API
  before_action :authenticate_request!

  private

  def authenticate_request!
    header = request.headers["Authorization"]
    token = header&.split(" ")&.last
    raise StandardError, "Missing token" unless token

    @current_user_payload = JsonWebToken.decode(token)
    @current_user = User.find(@current_user_payload[:id])
  rescue StandardError => e
    render json: { error: "Unauthorized: #{e.message}" }, status: :unauthorized
  end

  def current_user
    @current_user
  end
end
