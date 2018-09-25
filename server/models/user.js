const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    // validate is gonna be an object whith two properties:
    // validator - actual function that makes sure the value is valid -  and message.
    validate: {
      // Custom validation is declared by passing a validation function
      // Validator function receive the value to validate as their first argument and must return Boolean. True if value is valid, false if not. Returning false or throwing an error means validation failed.
      // !! shortcut!  - validator: validator.isEmail; -  no need to have a custom function!!
      validator: function(value) {
        // we use a library to validate the email. The method returns true or false.
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      reqiured: true
    },
    token: {
      type: String,
      reqiured: true
    }
  }]
});


// toJSON method (mongoose applies it automagically right?)
// determines what exactly get sent back when a mongoose model is converted into a json value
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};


// to create a method on the schema . its an object where we can add custom instance methods
// instance methods are available on the actual document, instance of the model
// Use standard fuction declaration because we need the binded "this"
// "this" stores the individual document
UserSchema.methods.generateAuthToken = function() {
  // "this" stores the actual document, we assign it to user for convenience and consistency (same name as the usually used document variable)
  // instance methods get called with the individual document binded to "this"
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  // use concat instead of push because push has inconstencies across mongodb versions.
  user.tokens = user.tokens.concat([{access, token}]);

  // returning a value, that will be passed as the success arg for the next then call (happening inside server.js)
  return user.save().then(function() {
    // usually you return another promise to chain. now we returns a value
    return token;
  });
};

// static methods are methods available on the Model
UserSchema.statics.findByToken = function(token) {
  // static method get called with the Model as the "this" binding
  User = this;
  var decoded; // end result of jwt.verify()

  // jwt.verfy() throw an error if something goes wrong, that's why we need try/catch blocks
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    // return a promises that always gonna reject. if this code runs we never want the User.findOne below to run
    // A shorten: return Promise.reject()
    console.log('token did not verify. jwt.verify throw error');
    return new Promise(function(resolve, reject) {
      // if reject, in server.js success case never called but catch is called
      reject();
    });
  }

  // findOne returns a promise. And we're gonna return that promise so that we can chain inside server.js
  return User.findOne({
    _id: decoded._id,
    // quotes are required when you have a dot, for nested documents ??
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, plainPassword) {
  var User = this;

  // must return it because we need to chain in server.js!!
  return User.findOne({email}).then(function(user) {
    // if user not found for some reason
    if (!user) {
      return Promise.reject('User does not exist.'); // and the catch block on server.js will run. And execution stops here thanks to the return
    }
    // if found correctly, check if plainPassword match the hashed password stored in db
    // bcryptjs only supports callbacks, so we need to wrap it inside a promise
    return new Promise(function(resolve, reject) {
      bcrypt.compare(plainPassword, user.password, function(err, bool) {
        if (bool) {
          resolve(user);
        } else {
          reject('Password did not match.');
        }
      });
    });
  });
};

// mongoose middleware, will run before save event and hash the password if it's been modified
UserSchema.pre('save', function(next) {
  var user = this;

  // if we save the document because we change something else than the password, hashing must not run otherwise we'll hash the hash
  // isModified returns true if the user pw was modified
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        // override the plain text user password with the hashed password
        user.password = hash;
        next();
      });
    });
  } else {
    // if not just go next
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}
