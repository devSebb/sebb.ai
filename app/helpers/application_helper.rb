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
end
