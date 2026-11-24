require "test_helper"

class ContactsControllerTest < ActionDispatch::IntegrationTest
  include ActionMailer::TestHelper

  VALID = { name: "Test User", email: "test@example.com", message: "Hello" }.freeze

  # A local .env may set CONTACT_RECIPIENT. Each test decides it for itself.
  setup do
    @saved_recipient = ENV.delete("CONTACT_RECIPIENT")
  end

  teardown do
    ENV["CONTACT_RECIPIENT"] = @saved_recipient
  end

  test "valid submission emails the owner and flashes success" do
    assert_emails 1 do
      post contact_url, params: { contact: VALID }
    end

    mail = ActionMailer::Base.deliveries.last
    assert_equal [ Portfolio::Content.contact[:email_to] ], mail.to
    assert_equal [ "test@example.com" ], mail.reply_to
    assert_includes mail.text_part.body.to_s, "Hello"

    assert_redirected_to root_url
    follow_redirect!
    assert_select "[data-controller='flash'][role='status']"
    assert_select "[data-controller='flash']", text: /get back to you/
  end

  test "CONTACT_RECIPIENT overrides the address shown on the site" do
    ENV["CONTACT_RECIPIENT"] = "inbox@example.com"
    post contact_url, params: { contact: VALID }

    assert_equal [ "inbox@example.com" ], ActionMailer::Base.deliveries.last.to
  end

  test "invalid submission sends no mail and flashes an error" do
    assert_no_emails do
      post contact_url, params: { contact: { name: "", email: "invalid", message: "" } }
    end

    assert_redirected_to root_url(anchor: "contact")
    get root_url
    assert_select "[data-controller='flash'][role='alert']"
  end

  test "a filled-in honeypot sends nothing but still looks like success" do
    assert_no_emails do
      post contact_url, params: { contact: VALID.merge(homepage: "http://spam.example") }
    end

    assert_redirected_to root_url
    follow_redirect!
    assert_select "[data-controller='flash']", text: /get back to you/
  end

  test "the form renders the hidden honeypot field" do
    get root_url
    assert_select "input[name='contact[homepage]'][tabindex='-1']"
  end

  test "a failed send tells the visitor instead of returning a 500" do
    ContactMailer.stub(:contact_email, ->(_contact) { raise Errno::ECONNREFUSED }) do
      post contact_url, params: { contact: VALID }
    end

    assert_redirected_to root_url(anchor: "contact")
    get root_url
    assert_select "[data-controller='flash'][role='alert']", text: /didn't send/
  end
end
