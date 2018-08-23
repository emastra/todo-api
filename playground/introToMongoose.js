var mongoose = require('mongoose');

// mongoose configuration
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// create a schema. Each schema maps to a MongoDB collection
// and defines the shape of the documents within that collection.
var todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// create a model
// to use our schema definition, we need to convert our todoSchema into a Model we can work with.
// To do so, we pass it into mongoose.model(modelName, schema)
// ! Instances of Models are documents
var Todo = mongoose.model('Todo', todoSchema);


// create an instance of the Todo model.
// An instance of a model corresponds to a document (in the database)!
var newTodo = new Todo({
  text: 'Cook dinner'
});

// save the document. Returns a promise.
newTodo.save().then(function(doc) {
  console.log('saved todo', doc);
}, function(err) {
  console.log('Unable to save todo', err);
});


/*
// SAME THINGS HERE BUT FOR USER without defining a schema first

// I'm not defining the schema first here
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

// create an instance of the Todo model, that is a document!
var aUser = new User({
  email: 'test@test'
});

aUser.save().then(function(doc) {
  console.log('user created', doc);
}, function(err) {
  console.log('Unable to create new user', err);
})
*/
