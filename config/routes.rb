Rails.application.routes.draw do
  root "pages#home"

  get "resume", to: "pages#resume"
  get "design", to: redirect("https://simple-way-402038.framer.app/", status: 302)

  get "up" => "rails/health#show", as: :rails_health_check

  get "service-worker.js", to: "pwa#service_worker", as: :pwa_service_worker
  get "manifest.json", to: "pwa#manifest", as: :pwa_manifest

  post "/contact", to: "contacts#create"

  get "/projects/:name", to: "pages#project", as: "project"
end
