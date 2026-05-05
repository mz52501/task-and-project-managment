class UsersController < ApplicationController
  def index
    users = User.select(:id, :first_name, :last_name, :email, :role)
    render json: users
  end

  def show
    user = User.find(params[:id])
    render json: user.slice(:id, :first_name, :last_name, :email, :role)
  end
end
