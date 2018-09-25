const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

// require the configured mongoose
// with ES6 destructuring it would be:  var {mongoose} = require('./db/mongoose.js');
var mongoose = require('./db/mongoose.js').mongoose;
// require Todo and User models! To be used to create instances of model with specific info that will be a doc in db. then we can save it.
var Todo = require('./models/todo.js').Todo;
var User = require('./models/user.js').User;
var authenticate = require('./middleware/authenticate').authenticate;
//const bcrypt = require('bcryptjs');

var app = express();
// if app running on heroku use process.env.PORT, if not use local 3000
var port = process.env.PORT || 3000;


//
// Middleware
//

// the returned value from the bodyParser json method is a function,
// and that is the middleware we need to give to express
app.use(bodyParser.json());


//
// Routes
//

app.post('/todos', function(req, res) {
  // create an instance of Todo model with the actual received info.
  // the body prop on the req obj is created by bodyParser middleware
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(function(doc) {
    res.send(doc);
  }, function(err) {
    res.status(400).send(err);
  });
});

app.get('/todos', function(req, res) {
  // Documents can be retrieved through find, findOne and findById. These methods are executed on your Models.
  // the success case callback gets called with the result of find(), which is an array!
  Todo.find().then(function(todos) {
    // ...so place the array inside an object. It's more flexible!
    res.send({ todos: todos });
  }, function(err) {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', function(req, res) {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send(); // Andrew uses 404
  }
  Todo.findById(id).then(function(todo) {
    if (!todo) {
      return res.status(404).send();
    }
    // all was good so send back the doc
    res.send(todo);
  }).catch(function(err) {
    res.status(500).send(); // A uses 400
  });
});

app.delete('/todos/:id', function(req, res) {
  // get the id
  var id = req.params.id;
  // validate the id, if not valid send 400 - A uses 404
  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }
  // delete todo by id
  Todo.findByIdAndDelete(id).then(function(todo) {
    // success case
    // if doc id was not found, it returns null, so check and in case send 404
    if(!todo) {
      return res.status(404).send();
    }
    // all is good
    res.send(todo);
  }).catch(function(err) {
    // there was an error during the process
    // if the error is not inside the then-callback func, the error is catched by express which sends and html error document
    console.log(err);
    res.status(500).send();
  });
});

app.patch('/todos/:id', function(req, res) {
  var id = req.params.id;
  // if I set body equal to req.body I risk that user modify or add some properties that he should not, like completedAt
  // based on the model, user should only be able to modify "text" and "completed".
  // with _.pick you can pass an array of the props to pull off from the body obj (if they exist)
  var body = _.pick(req.body, ["text", "completed"]);

  // validating the id
  if (!ObjectID.isValid(id)) {
    return res.status(400).send(); // Andrew uses 404
  }

  // check the completed value (eventually provided by the user) and set completedAt accordingly
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // query to update the database
  // on updates you have to use the ! mongodb update operators! otherwise risk to replace the whole document!
  // option needed to get the updated doc back instead of the original
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(function(todo) {
    if(!todo) {
      return res.status(404).send();
    }
    // all was good then send back the updated doc
    res.send(todo);
  }).catch(function(err) {
    console.log(err);
    res.status(500).send();
  });
});

app.post('/users', function(req, res) {
  var body = _.pick(req.body, ["email", "password"]); // !! express catches sync errors by its own. if err here returns 500 not the 400 of the catch below!!!
  // no need to create the obj manually because we have body obj ready to go
  var user = new User(body);

  user.save().then(function(user) { // A removes that user arg, becuase user below is the same as above ?? so its easy to understand code about waht we're sending. with or without, works the same
    return user.generateAuthToken(); // return it because we are expecting to chain it
    // res.send(user);
  }).then(function(token){
    res.header('x-auth', token).send(user);
  }).catch(function(err) {
    console.log(err);
    res.status(400).send(err);
  });
});

// authenticate middleware inside
app.get('/users/me', authenticate, function(req, res) {
  // if get request pass all the authentication middleware, we just send back the user (which is inside req.user, set by the middleware)
  res.send(req.user);
});

// // login route
// app.post('/users/login', function(req, res) {
//   var email = req.body.email;
//   var plainPassword = req.body.password;
//
//   User.findOne({email: email}).then(function(user) {
//     //console.log(user);
//     bcrypt.compare(plainPassword, user.password, function(err, bool) {
//       if (bool) {
//         res.send(_.pick(user, ["email"]));
//       } else {
//         res.status(401).send();
//       }
//     });
//   }).catch(function(err) {
//     console.log(err);
//     res.status(400).send(err);
//   });
// });

app.post('/users/login', function(req, res) {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then(function(user) {
    // the check if user existed was done in Model.findByCredentials, so here is all ok
    // user we received back is an instance so i can use the instance methods...
    return user.generateAuthToken().then(function(token) {
      res.header('x-auth', token).send(user);
    });
  }).catch(function(err) {
    // if any errors or reject()s along the way
    console.log('1111', err)
    res.status(400).send(err);
  });
});

app.delete('/users/me/token', authenticate, function(req, res) {
  // access the instance method. the user get stored inside the req obj by the authenticate middleware // and the token as well
  req.user.removeToken(req.token).then(function() {
    // we dont need any data back. just know if removing token was success or not. this callback is for the success case.
    res.status(200).send();
  }, function() {
    // this is for failure case
    res.status(400).send();
  });
});

//
// Listen
//

app.listen(port, function() {
  console.log(`App started up at port ${port}`);
});

// // for use in tests files, the app needs to be exported
// module.exports = {
//   app: app
// }
