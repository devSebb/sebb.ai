require "test_helper"

class ContactsControllerTest < ActionDispatch::IntegrationTest
  test "creates contact with valid params" do
    assert_difference("Contact.count", 1) do
      post contact_url, params: { contact: { name: "Test User", email: "test@example.com", message: "Hello" } }
    end

    assert_redirected_to root_url
  end

  test "does not create contact with invalid params" do
    assert_no_difference("Contact.count") do
      post contact_url, params: { contact: { name: "", email: "invalid", message: "" } }
    end

    assert_redirected_to root_url(anchor: "contact")
  end
end
