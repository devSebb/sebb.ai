class ContactsController < ApplicationController
  def create
    @contact = Contact.new(contact_params)

    if @contact.save
      ContactMailer.contact_email(@contact).deliver_now
      flash[:success] = "Your message has been sent!"
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
end
