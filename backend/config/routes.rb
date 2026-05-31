Rails.application.routes.draw do
  mount ActionCable.server => "/cable"
  get "up" => "rails/health#show", as: :rails_health_check

  post "auth/login",    to: "auth#login"
  post "auth/register", to: "auth#register"

  get  "invite/:token",        to: "invite_acceptances#show"
  post "invite/:token/accept", to: "invite_acceptances#accept"

  get   "me",  to: "users#me"
  patch "me",  to: "users#update_me"

  resources :workspaces, only: [:index, :create, :show, :update, :destroy] do
    resources :members,  controller: "workspace_members", only: [:index, :update, :destroy]
    resources :invites,  controller: "workspace_invites",  only: [:index, :create, :destroy]
    resources :users,    only: [:index]

    resources :projects do
      resources :members, controller: "project_members", only: [:create, :destroy]
      resources :stages,  controller: "workflow_stages",  only: [:index, :create, :update, :destroy]
      resources :tags,    only: [:index, :create, :update, :destroy]
    end

    resources :tasks do
      resources :comments,    only: [:index, :create]
      resources :assignments, controller: "task_assignments", only: [:index, :create, :destroy]
      resources :tags,        controller: "task_tags",        only: [:create, :destroy]
    end

    resources :events,        only: [:index, :create, :destroy]
    resources :activity_logs, only: [:index]

    get  "dashboard",    to: "dashboard#index"
    get  "timer/status", to: "timer#status"
    post "timer/start",  to: "timer#start"
    post "timer/stop",   to: "timer#stop"
  end

  resources :comments,      only: [:update, :destroy]
  resources :time_entries,  only: [:index, :create, :update, :destroy]
  resources :notifications, only: [:index, :destroy] do
    member { patch :mark_read }
  end
end
