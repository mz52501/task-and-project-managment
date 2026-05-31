class AuthController < ApplicationController
  skip_before_action :authenticate_request!, only: [ :login, :register ]

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = JsonWebToken.encode({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      })
      render json: { token: token, user: user_json(user) }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def register
    user = User.new(register_params)

    if user.save
      token = JsonWebToken.encode({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      })
      render json: { token: token, user: user_json(user) }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def register_params
    params.permit(:first_name, :last_name, :email, :password, :role)
  end

  def user_json(user)
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      current_workspace_id: user.current_workspace_id
    }
  end
end
