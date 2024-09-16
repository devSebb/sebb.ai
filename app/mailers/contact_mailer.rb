class ContactMailer < ApplicationMailer
  def contact_email(contact)
    @contact = contact
    mail(to: "burke.sebastian1@gmail.com", subject: "New Contact Form Submission")
  end
end
