const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database');
})

mongoose.connection.on('connected', function() {
  console.log('succesfully connected to database');
})
mongoose.connect(process.env.MONGODB_URI);

var models = require('./models/models');
var User = models.User;
var Contacts = models.Contacts;

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json())

//
// var contactList = new Contacts ({
//   users: [newContact]
// });
//
// contactList.save(function(err) {
//   if (err) {
//     console.log('error saving contact list');
//   } else {
//     console.log('saved contact list');
//   }
// })

//routes
app.get('/contactlist', function (req, res) {
  Contacts.find(function(err, contacts) {
    if (err) {
      console.log(err);
    } else {
      res.json(contacts);
    }
  })
});

app.post('/newcontact', function(req, res) {
  var newContact = new User({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    birthday: req.body.birthday
  });
  newContact.save(function(err) {
    if (err) {
      console.log("could not save contact in post newcontact")
    }
  });
  Contacts.findOne({_id: "5b634a564e694f407b7d905e"}, function(err, list) {
    if (err) {
      console.log("couldn't find that contact list");
    } else {
        list.users.push(newContact);
        list.save(function(err) {
          if (err) {
            console.log('could not save that user to the contact list');
          }
        })
    }
  });
  res.json(newContact);
});


app.post('/deleteContact', function(req, res) {
  Contacts.find(function(err, contacts) {
    if (err) {
      console.log(err);
    } else {
      User.findOneAndRemove({_id: contacts[0].users[req.body.index]._id}, function(err) {
        if (err) {
          console.log('could not remove user');
        }
      })
      contacts[0].users.splice(req.body.index, 1);
      contacts[0].save(function(err) {
        if (err) {
          console.log('couldnt save list after deleting contact');
        }
      })
      res.json(contacts);
    }
  })
})

app.post('/editContact', function(req, res) {
  Contacts.find(function(err, contacts) {
    if (err) {
      console.log(err);
    } else {
    //  console.log(contacts[0].users[req.body.index]);
      contacts[0].users[req.body.index].name = req.body.name;
      contacts[0].users[req.body.index].phoneNumber = req.body.phoneNumber;
      contacts[0].users[req.body.index].birthday = req.body.birthday;

      User.findOne({_id: contacts[0].users[req.body.index]._id}, function(err, user) {
        if (err) {
          console.log('could not find user to edit');
        } else {
          user.name = req.body.name;
          user.phoneNumber = req.body.phoneNumber;
          user.birthday = req.body.birthday;
          user.save(function(err) {
            if (err) {
              console.log('could not save the new user');
            }
          })
        }
      });

      contacts[0].save(function(err) {
        if (err) {
          console.log('could not save edited user to the list');
        }
      });

      Contacts.findOneAndUpdate({_id: contacts[0]._id}, {
        users: contacts[0].users
      }, function(err) {
        if (err) {
          console.log('could not find and update');
        }
      })

      res.json(contacts);
    //  contacts[0].users.splice(req.body.index, 1);

      // contacts[0].save(function(err) {
      //   if (err) {
      //     console.log('couldnt save list after deleting contact');
      //   }
      // })
      // res.json(contacts);
    }
  })
})



// DO NOT REMOVE THIS LINE :)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 1337);
