var ObjectID = require('mongodb').ObjectID;

var mongoose = require('./../server/db/mongoose.js').mongoose;
var Todo = require('./../server/models/todo.js').Todo;
var User = require('./../server/models/user.js').User;

var id = '5b7d3503e70ae91736ef54a411';

// catch not valid id with ObjectID valid method
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }

// Todo.find({
//   // mongoose converts the id string into an object id automatically
//   _id: id
// }).then(function(todos) {
//   console.log('todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then(function(todo) {
//   console.log('todo', todo);
// });

// Todo.findById(id).then(function(todo) {
//   if (!todo) {
//     return console.log('Id not found!');
//   }
//   console.log('todo by id', todo);
// }).catch(function(err) {
//   console.log(err);
// });

User.findById('5b7d3dc0acf7591e189d7979').then(function(user) {
  if (!user) return console.log('User id not found!');
  console.log('User found.', user);
}, function(err) {
  console.log(err);
});
