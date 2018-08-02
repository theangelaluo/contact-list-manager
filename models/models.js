var mongoose = require('mongoose');

//console.log(process.env.MONGODB_URI);

if (!process.env.MONGODB_URI){
  console.log('Error: MONGODB_URI NOT SET');
  process.exit(1);
}

var userSchema = {
  phoneNumber: {
    type: String,
  },
  name: {
    type: String,
  },
  birthday: {
    type: String
  }
}

var contactsSchema = {
  users: {
    type: Array
  }
}

var User = mongoose.model("User", userSchema);
var Contacts = mongoose.model("Contacts", contactsSchema);

module.exports = {
  User: User,
  Contacts: Contacts
}
