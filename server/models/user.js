const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
// Use standard fuction declaration because we need the binded "this"
// "this" stores the individual document
UserSchema.methods.generateAuthToken = function() {
  // "this" stores the actual document, we assign it to user for convenience and consistency (same name as the usually used document variable)
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

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}
