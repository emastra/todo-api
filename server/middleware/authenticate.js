var {User} = require('./../models/user');

// authenticate middleware makes sure the user is logged in and
// gives us access to user and token in the req object when we are in server.js

var authenticate = function(req, res, next) {
  var token = req.header('x-auth');

  User.findByToken(token).then(function(user) {
    if (!user) {
      // res.status(401).send()
      // or just call reject and catch block below will run. dont forget to return to stop execution!!
      return Promise.reject();
    }
    // success case here
    // we modify the req obj so we can use it inside the route functions
    // we place the found user and the received token inside the req object
    req.user = user;
    req.token = token;
    next();
  }).catch(function(err) {
    // catch callback get called if findByToken rejects
    res.status(401).send();
  });
};

module.exports = {
  authenticate: authenticate
};
