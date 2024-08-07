require "sidekiq/web"

Rails.application.routes.draw do
  namespace :api do
    resources :frontal, only: [:index]
  end

  scope :api do
    get "ping", to: "ping#show"

    resources :enrollments do
      collection do
        get :public
        get :user
        get :export, to: "enrollments_live#export"

        get :hubee_validated, to: "enrollments_hubee_validated#index"
      end
      member do
        patch :change_state
        post :copy
        get :copies
        get :next_enrollments
        patch :mark_event_as_processed

        get :email_templates, to: "enrollments_email_templates#index"
      end

      resources :validated_enrollment_snapshots, only: [:show], path: "validated"

      resources :opinions, only: [:index, :create, :show, :destroy] do
        resources :opinion_comments, path: "comments", only: [:create, :destroy]
      end
    end

    resources :reopen_enrollments, only: [:update]

    get "enrollments/:target_api/available_reporters", to: "available_reporters#index"

    get "/data_provider_configurations", to: "data_provider_configurations#index"
    get "/data_provider_configurations/:target_api", to: "data_provider_configurations#show"

    get "/users/me", to: "users#me"
    get "/users/join_organization", to: "users#join_organization"
    get "/users/personal_information", to: "users#personal_information"
    devise_scope :user do
      get "/users/sign_out", to: "users/sessions#destroy", as: :destroy_user_session
    end

    resources :users, except: [:destroy, :show]
    resources :team_members, only: [:update]

    get "/stats", to: "stats#show"
    get "/stats/majority_percentile_processing_time_in_days", to: "stats#majority_percentile_processing_time_in_days"

    get "/events/most-used-comments", to: "events#most_used_comments"

    get "/insee/etablissements/:siret", to: "insee#etablissements", siret: /\d{14}/
    get "/insee/etablissements/ping", to: "insee#ping"
    get "/insee/codes_naf/:id", to: "insee#codes_naf", id: /\d{2}\.\d{2}[A-Z]/
    get "/insee/categories_juridiques/:id", to: "insee#categories_juridiques", id: /[0-9]{1,4}/

    get "/api_gouv/apis", to: "api_gouv#apis"

    resources :documents, only: :show
  end

  devise_scope :api do
    devise_for :users, controllers: {
      omniauth_callbacks: "users/sessions",
      sessions: "devise/sessions"
    }
  end

  authenticate :user, lambda { |u| u.is_administrator? } do
    mount Sidekiq::Web => "/sidekiq"
  end
end
