require "yaml"

module Portfolio
  class Content
    FILE_PATH = Rails.root.join("config/content/portfolio.yml").freeze

    class << self
      def data
        @data ||= begin
          loaded = YAML.safe_load_file(FILE_PATH, permitted_classes: [], aliases: false) || {}
          Schema.validate!(loaded)
          loaded.deep_symbolize_keys
        end
      end

      def reload!
        @data = nil
        data
      end

      def identity
        data.fetch(:identity)
      end

      def links
        data.fetch(:links)
      end

      def about
        data.fetch(:about)
      end

      def tech_icons
        data.fetch(:tech_icons)
      end

      def tech_stack
        data.fetch(:tech_stack)
      end

      def experience
        data.fetch(:experience)
      end

      def skills_categories
        data.fetch(:skills_categories)
      end

      def projects
        data.fetch(:projects)
      end

      def project_by_slug(slug)
        projects.find { |project| project[:slug] == slug.to_s }
      end

      def adjacent_projects(slug)
        all = projects
        idx = all.index { |p| p[:slug] == slug.to_s }
        return { prev: nil, next: nil } unless idx

        {
          prev: all[(idx - 1) % all.size],
          next: all[(idx + 1) % all.size]
        }
      end

      def resume
        data.fetch(:resume)
      end

      def contact
        data.fetch(:contact)
      end
    end
  end
end
