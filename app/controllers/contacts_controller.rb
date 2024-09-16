class ContactsController < ApplicationController
  def create
    # Handle form submission
    @contact = Contact.new(contact_params)

    if @contact.save
      # Send email or perform other actions
      flash[:success] = "Your message has been sent!"
      redirect_to root_path
    else
      flash[:error] = "There was an error sending your message."
      render "new"
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :message)
  end
end
