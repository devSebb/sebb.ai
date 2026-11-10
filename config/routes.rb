Rails.application.routes.draw do
  root "pages#home"

  get "resume", to: "pages#resume"
  get "design", to: redirect("https://simple-way-402038.framer.app/", status: 302)

  get "up" => "rails/health#show", as: :rails_health_check

  get "service-worker.js", to: "pwa#service_worker", as: :pwa_service_worker
  get "manifest.json", to: "pwa#manifest", as: :pwa_manifest
  get "sitemap.xml", to: "pages#sitemap", defaults: { format: "xml" }

  post "/contact", to: "contacts#create"

  # Retired projects keep their addresses alive and point at the collection.
  %w[billdeck tripstein showbox whitetigerdesign].each do |slug|
    get "/projects/#{slug}", to: redirect("/#projects", status: 301)
  end

  # A room's film on its own, for embedding in the home page reel.
  get "/projects/:name/film", to: "pages#film", as: "project_film"
  get "/projects/:name", to: "pages#project", as: "project"
end
