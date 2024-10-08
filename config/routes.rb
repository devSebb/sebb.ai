Rails.application.routes.draw do
  root "pages#home"

  get "resume", to: "pages#resume"

  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  post "/contact", to: "contacts#create"
end
