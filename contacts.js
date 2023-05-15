const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
require("colors");

const contactsPath = path.join(__dirname, "db", "contacts.json");
const successMsg = `Task completed successfully!`.green;
const errorMsg = `Something went wrong!`.red;

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.log(errorMsg);
  }
}

async function getContactById(contactId) {
  const noContactMsg = `There is no contact with ${contactId} id!`.red;
  try {
    const contacts = await listContacts();
    const result = contacts.find((contact) => contact.id === contactId);
    if (result) {
      console.log(successMsg);
      return result;
    }
    throw new Error();
  } catch (error) {
    console.log(noContactMsg);
    return null;
  }
}

async function removeContact(contactId) {
  const noContactMsg = `There is no contact with ${contactId} id!`.red;
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      console.log(noContactMsg);
      return null;
    }
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(successMsg);
    return result;
  } catch (error) {
    console.log(errorMsg);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(successMsg);
    return newContact;
  } catch (error) {
    console.log(errorMsg);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
