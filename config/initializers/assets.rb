# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path

# Ensure Sprockets can find files in app/javascript for Importmap pins
Rails.application.config.assets.paths << Rails.root.join("app/javascript")

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
# Rails.application.config.assets.precompile += %w[ admin.js admin.css ]

# Ensure all ESM modules under app/javascript are precompiled with their logical paths
js_root = Rails.root.join("app/javascript")
Rails.application.config.assets.precompile += Dir.glob(js_root.join("**/*.js")).map {
  |path| Pathname.new(path).relative_path_from(js_root).to_s
}
