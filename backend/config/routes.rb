Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  post "auth/login", to: "auth#login"
  post "auth/register", to: "auth#register"

  resources :users, only: [ :index, :show ]

  resources :projects do
    resources :members, controller: "project_members", only: [ :create, :destroy ]
    resources :stages, controller: "workflow_stages", only: [ :index, :create, :update, :destroy ]
    resources :tags, only: [ :index, :create, :update, :destroy ]
  end

  resources :tasks do
    resources :comments, only: [ :index, :create ]
    resources :assignments, controller: "task_assignments", only: [ :index, :create, :destroy ]
    resources :tags, controller: "task_tags", only: [ :create, :destroy ]
  end

  resources :comments, only: [ :destroy ]
  resources :time_entries, only: [ :index, :create, :destroy ]
  resources :notifications, only: [ :index ] do
    member do
      patch :mark_read
    end
  end
  resources :events, only: [ :index, :create, :destroy ]
end
