class AddFieldsToContacts < ActiveRecord::Migration[7.2]
  def change
    add_column :contacts, :name, :string
    add_column :contacts, :email, :string
    add_column :contacts, :message, :text
  end
end
