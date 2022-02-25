require "sidekiq/web"

Rails.application.routes.draw do
  scope :api do
    resources :enrollments do
      collection do
        get :public
        get :user
        get :export
      end
      member do
        patch :change_state
        post :copy
        get :copies
        get :next_enrollments

        get :email_templates, to: "enrollments_email_templates#index"
      end
    end

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

    post "/sendinblue-webhooks/rgpd-contact-error/:capability_url_id",
      to: "sendinblue_webhooks#rgpd_contact_error",
      constraints: {capability_url_id: /[A-Za-z0-9]{64}/}

    get "/insee/code_naf/:id", to: "insee#code_naf", id: /\d{2}\.\d{2}[A-Z]/
    get "/insee/categorie_juridique/:id", to: "insee#categorie_juridique", id: /[0-9]{1,4}/
  end

  devise_scope :api do
    devise_for :users, controllers: {
      omniauth_callbacks: "users/sessions",
      sessions: "devise/sessions"
    }
  end

  get "/uploads/:model/:type/:mounted_as/:id/:filename", to: "documents#show", constraints: {filename: /[^\/]+/}

  authenticate :user, lambda { |u| u.is_administrator? } do
    mount Sidekiq::Web => "/sidekiq"
  end
end
