require "test_helper"

class ContactsControllerTest < ActionDispatch::IntegrationTest
  include ActionMailer::TestHelper

  test "valid submission creates a contact, enqueues a notification, and flashes success" do
    assert_difference("Contact.count", 1) do
      assert_enqueued_emails 1 do
        post contact_url, params: { contact: { name: "Test User", email: "test@example.com", message: "Hello" } }
      end
    end

    assert_redirected_to root_url
    follow_redirect!
    assert_select "[data-controller='flash'][role='status']"
    assert_select "[data-controller='flash']", text: /get back to you/
  end

  test "invalid submission saves nothing, sends no mail, and flashes an error" do
    assert_no_difference("Contact.count") do
      assert_no_enqueued_emails do
        post contact_url, params: { contact: { name: "", email: "invalid", message: "" } }
      end
    end

    assert_redirected_to root_url(anchor: "contact")
    # Flash persists for the next request; render the home page to see the toast.
    get root_url
    assert_select "[data-controller='flash'][role='alert']"
  end
end
