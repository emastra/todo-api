var mongoose = require('mongoose');

// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.
var Todo = mongoose.model('Todo', {   // The following is is the schema
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
  },
  // the underscore (it's only style) indicates that the prop is an object id
  _creator: {
    type: mongoose.Schema.Types.ObjectId, // it's an object id, it's the object id of the logged in user 
    required: true
  }
});

module.exports = {
  Todo: Todo
}
