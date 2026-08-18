class PwaController < ApplicationController
    def manifest
      render file: "app/views/pwa/manifest.json.erb", content_type: "application/json"
    end

    def service_worker
      render file: "app/views/pwa/service-worker.js", content_type: "application/javascript"
    end
end
