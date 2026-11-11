class ContactsController < ApplicationController
  def create
    contact = Contact.new(contact_params)

    if contact.invalid?
      flash[:error] = contact.errors.full_messages.to_sentence
    elsif send_to_inbox(contact)
      flash[:success] = "Thanks for reaching out — I'll get back to you soon."
      return redirect_to root_path, status: :see_other
    else
      flash[:error] = "That didn't send. Email me at #{Portfolio::Content.contact[:email_to]} instead."
    end

    redirect_to root_path(anchor: "contact"), status: :see_other
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :message)
  end

  # The email is the only copy of the message, so send it during the request.
  # That way the visitor is told when it fails, instead of it vanishing.
  def send_to_inbox(contact)
    ContactMailer.contact_email(contact).deliver_now
    true
  rescue StandardError => e
    Rails.logger.error("[ContactsController] contact email failed: #{e.class}: #{e.message}")
    false
  end
end
