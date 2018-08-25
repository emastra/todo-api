var express = require('express');
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;

// with ES6 destructuring it would be:  var {mongoose} = require('./db/mongoose.js');
var mongoose = require('./db/mongoose.js').mongoose;
// require Todo and User models! To be used to create instances of model with specific info that will be a doc in db. then we can save it.
var Todo = require('./models/todo.js').Todo;
var User = require('./models/user.js').User;

var app = express();
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
  // the success case callback gets called with the result of find() which is an array!
  Todo.find().then(function(todos) {
    // so place the array inside an object. It's more flexible!
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
  Todo.findById(req.params.id).then(function(todo) {
    if (!todo) {
      return res.status(404).send();
    }
    // All is good
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
    return res.status(400).send(); // Andrew uses 404
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
