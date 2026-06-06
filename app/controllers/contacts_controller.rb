class ContactsController < ApplicationController
  def create
    @contact = Contact.new(contact_params)

    if @contact.save
      notify_owner(@contact)
      flash[:success] = "Thanks for reaching out — I'll get back to you soon."
      redirect_to root_path
    else
      flash[:error] = @contact.errors.full_messages.to_sentence
      redirect_to root_path(anchor: "contact"), status: :see_other
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :message)
  end

  # The saved Contact is the source of truth; the email is a best-effort
  # notification. Deliver it off the request (deliver_later) so SMTP latency
  # or failure can never block or 500 the user's submission. The rescue only
  # guards enqueue-time errors — delivery errors surface in the job log.
  def notify_owner(contact)
    ContactMailer.contact_email(contact).deliver_later
  rescue => e
    Rails.logger.error("[ContactsController] contact notification failed to enqueue: #{e.class} — #{e.message}")
  end
end
