# Configure Action Mailer for sending contact form emails.
# Set these environment variables to enable SMTP delivery:
#
#   MAILER_FROM          - Sender address (e.g. "sebb.ai <burke.sebastian1@gmail.com>")
#   SMTP_ADDRESS         - SMTP server (e.g. smtp.gmail.com)
#   SMTP_PORT            - Port (default: 587)
#   SMTP_USERNAME        - SMTP username / email
#   SMTP_PASSWORD        - SMTP password (use Gmail App Password if using Gmail)
#
# For Gmail: Enable 2FA, then create an App Password at
# https://myaccount.google.com/apppasswords

if ENV["SMTP_ADDRESS"].present?
  Rails.application.config.action_mailer.delivery_method = :smtp
  Rails.application.config.action_mailer.smtp_settings = {
    address: ENV["SMTP_ADDRESS"],
    port: ENV.fetch("SMTP_PORT", 587).to_i,
    domain: ENV.fetch("SMTP_DOMAIN", "sebb.ai"),
    user_name: ENV["SMTP_USERNAME"],
    password: ENV["SMTP_PASSWORD"],
    authentication: ENV.fetch("SMTP_AUTHENTICATION", "plain"),
    enable_starttls_auto: true
  }
end
