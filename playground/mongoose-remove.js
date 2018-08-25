var ObjectID = require('mongodb').ObjectID;

var mongoose = require('./../server/db/mongoose.js').mongoose;
var Todo = require('./../server/models/todo.js').Todo;
var User = require('./../server/models/user.js').User;

// to remove all documents, pass an empty obj. Differently from find that you pass nothing.
// you get back  an object, with result prop which says how many docs were removed.
Todo.remove({}).then(function(result) {
  console.log(result);
});

// // returns the deleted doc
// Todo.findOneAndDelete({"text" : "This is from Postman!"}).then(function(doc) {
//   console.log(doc);
// });

// Todo.findByIdAndDelete('5b7e660f4fedae218af81b46').then(function(doc) {
//   console.log(doc);
// });
