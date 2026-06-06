require "test_helper"

class ContactTest < ActiveSupport::TestCase
  def valid_attributes
    { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" }
  end

  test "is valid with name, email, and message" do
    assert Contact.new(valid_attributes).valid?
  end

  test "requires a name" do
    contact = Contact.new(valid_attributes.merge(name: ""))
    assert_not contact.valid?
    assert_includes contact.errors[:name], "can't be blank"
  end

  test "requires a message" do
    contact = Contact.new(valid_attributes.merge(message: ""))
    assert_not contact.valid?
    assert_includes contact.errors[:message], "can't be blank"
  end

  test "requires a present email" do
    contact = Contact.new(valid_attributes.merge(email: ""))
    assert_not contact.valid?
    assert_includes contact.errors[:email], "can't be blank"
  end

  test "rejects a malformed email" do
    contact = Contact.new(valid_attributes.merge(email: "not-an-email"))
    assert_not contact.valid?
    assert_includes contact.errors[:email], "is invalid"
  end
end
