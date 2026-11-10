module ApplicationHelper
  # Presentation metadata for flash toasts, keyed by flash type.
  # `accent` drives the colored bar/label; role + aria_live keep the
  # toast announced correctly to assistive tech.
  FLASH_STYLES = {
    "success" => { accent: "#0ED762", label: "Sent",      role: "status", aria_live: "polite" },
    "notice"  => { accent: "#0ED762", label: "Notice",    role: "status", aria_live: "polite" },
    "error"   => { accent: "#EF4444", label: "Error",     role: "alert",  aria_live: "assertive" },
    "alert"   => { accent: "#F59E0B", label: "Heads up",  role: "alert",  aria_live: "assertive" }
  }.freeze

  DEFAULT_FLASH_STYLE = FLASH_STYLES.fetch("notice")

  def flash_style(type)
    FLASH_STYLES.fetch(type.to_s, DEFAULT_FLASH_STYLE)
  end

  # ── Tool logos ──────────────────────────────────────────────────────────
  # Monochrome brand marks live as standalone SVGs in LOGO_DIR. They are
  # emitted once per page as a <symbol> sprite and referenced with <use>, so
  # 45 marks cost one inline block instead of 45 requests — and, unlike an
  # <img>, the paths inherit currentColor and can be tinted on hover.
  LOGO_DIR = Rails.root.join("app/assets/images/techstack/logos").freeze
  LOGO_SLUG = /\A[a-z0-9_-]+\z/

  def tech_logo_sprite(slugs)
    symbols = Array(slugs).uniq.filter_map { |slug| logo_symbol(slug) }
    return "".html_safe if symbols.empty?

    tag.svg(
      raw(symbols.join),
      class: "sr-only absolute w-0 h-0 overflow-hidden",
      aria: { hidden: true },
      focusable: false
    )
  end

  def tech_logo(slug, css_class: "tech-logo")
    return "".html_safe unless logo_available?(slug)

    tag.svg(
      raw(%(<use href="##{logo_symbol_id(slug)}"></use>)),
      class: css_class,
      aria: { hidden: true },
      focusable: false
    )
  end

  def logo_available?(slug)
    slug.to_s.match?(LOGO_SLUG) && LOGO_DIR.join("#{slug}.svg").file?
  end

  # ── Page metadata ───────────────────────────────────────────────────────
  # Controllers set @meta; anything missing falls back to the site defaults.
  SITE_URL = "https://sebb.ai".freeze
  DEFAULT_META = {
    title: "devSebb — Sebastian Burke, product engineer and designer",
    description: "devSebb is Sebastian Burke: I design, build and ship products end to end. " \
                 "Six live products, shown as working rooms you can touch.",
    path: "/",
    image: "og/home.jpg",
    type: "website"
  }.freeze

  def page_meta
    DEFAULT_META.merge((@meta || {}).compact)
  end

  def canonical_url(path = page_meta[:path])
    "#{SITE_URL}#{path}"
  end

  def person_structured_data(links = {})
    {
      "@context" => "https://schema.org",
      "@type" => "Person",
      "name" => "Sebastian Burke",
      "alternateName" => "devSebb",
      "url" => SITE_URL,
      "jobTitle" => "Forward Deployed Engineer",
      "knowsLanguage" => %w[en es],
      "sameAs" => links.values_at(:github, :linkedin, :x).compact
    }
  end

  def project_structured_data(project)
    data = {
      "@context" => "https://schema.org",
      "@type" => "CreativeWork",
      "name" => project[:name],
      "headline" => project[:tagline],
      "description" => project[:description],
      "url" => canonical_url("/projects/#{project[:slug]}"),
      "dateCreated" => project[:year],
      "creator" => { "@type" => "Person", "name" => "Sebastian Burke", "alternateName" => "devSebb", "url" => SITE_URL }
    }
    data["sameAs"] = project[:link] if project[:link].present?
    data
  end

  # Google Fonts stylesheet for a list of css2 family strings.
  def google_fonts_url(families)
    "https://fonts.googleapis.com/css2?" + Array(families).map { |family| "family=#{family}" }.join("&") + "&display=swap"
  end

  private

  def logo_symbol_id(slug)
    "tech-#{slug}"
  end

  def logo_symbol(slug)
    return nil unless logo_available?(slug)

    raw_svg = File.read(LOGO_DIR.join("#{slug}.svg"))
    inner = raw_svg[%r{<svg[^>]*>(.*)</svg>}m, 1]
    return nil if inner.blank?

    view_box = raw_svg[/viewBox="([^"]*)"/, 1] || "0 0 24 24"
    %(<symbol id="#{logo_symbol_id(slug)}" viewBox="#{view_box}">#{inner}</symbol>)
  end
end
