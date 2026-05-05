Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  post "auth/login", to: "auth#login"
  post "auth/register", to: "auth#register"

  resources :users, only: [ :index, :show ]

  resources :projects do
    resources :members, controller: "project_members", only: [ :create, :destroy ]
    resources :workflows, controller: "task_workflows", only: [ :index, :create ]
  end

  resources :tasks do
    resources :comments, only: [ :index, :create ]
    resources :subtasks, controller: "tasks", only: [ :index ]
  end

  resources :comments, only: [ :destroy ]
  resources :time_entries, only: [ :index, :create, :destroy ]
  resources :notifications, only: [ :index ] do
    member do
      patch :mark_read
    end
  end
end
