module Portfolio
  module Schema
    REQUIRED_TOP_LEVEL_KEYS = %w[
      identity
      links
      about
      tech_icons
      tech_stack
      experience
      skills_categories
      projects
      resume
      contact
    ].freeze

    REQUIRED_PROJECT_KEYS = %w[
      slug
      name
      tagline
      description
      detailed_description
      hero_image
      gallery
      theme_color
      year
      role
      features
      technologies
    ].freeze

    module_function

    def validate!(data)
      ensure_hash!(data, "root")
      ensure_required_keys!(data, REQUIRED_TOP_LEVEL_KEYS, "root")

      projects = data.fetch("projects")
      unless projects.is_a?(Array) && projects.any?
        raise ArgumentError, "projects must be a non-empty array"
      end

      slugs = projects.map { |project| validate_project!(project) }
      if slugs.uniq.size != slugs.size
        raise ArgumentError, "projects slugs must be unique"
      end

      true
    end

    def validate_project!(project)
      ensure_hash!(project, "project")
      ensure_required_keys!(project, REQUIRED_PROJECT_KEYS, "project")
      slug = project.fetch("slug")
      raise ArgumentError, "project slug must be present" if slug.to_s.strip.empty?

      slug
    end

    def ensure_hash!(obj, label)
      raise ArgumentError, "#{label} must be a hash" unless obj.is_a?(Hash)
    end
    private_class_method :ensure_hash!

    def ensure_required_keys!(obj, keys, label)
      missing = keys.reject { |key| obj.key?(key) }
      return if missing.empty?

      raise ArgumentError, "#{label} missing required keys: #{missing.join(', ')}"
    end
    private_class_method :ensure_required_keys!
  end
end
