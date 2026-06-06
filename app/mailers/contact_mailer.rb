class ContactMailer < ApplicationMailer
  def contact_email(contact)
    @contact = contact
    mail(
      to: recipient,
      reply_to: contact.email,
      subject: "New message from #{contact.name} — sebb.ai"
    )
  end

  private

  # Single source of truth: the recipient comes from the content file
  # (ENV-overridable for deploys), with a hardcoded fallback so a missing
  # value can never raise during delivery.
  def recipient
    ENV["CONTACT_RECIPIENT"].presence ||
      Portfolio::Content.contact[:email_to].presence ||
      "burke.sebastian1@gmail.com"
  end
end
