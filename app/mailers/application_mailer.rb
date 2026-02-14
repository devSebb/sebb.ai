class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_FROM", "sebb.ai <burke.sebastian1@gmail.com>")
  layout "mailer"
end
