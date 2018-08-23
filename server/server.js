var express = require('express');
var bodyParser = require('body-parser');

// with ES6 destructuring it would be:  var {mongoose} = require('./db/mongoose.js');
var mongoose = require('./db/mongoose.js').mongoose;
// require Todo and User models! To be used to create instances of model with specific info that will be a doc in db. then we can save it.
var Todo = require('./models/todo.js').Todo;
var User = require('./models/user.js').User;

var app = express();

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

app.listen(3000, function() {
  console.log('App started on port 3000');
});
