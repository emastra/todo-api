var mongoose = require('mongoose');

// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.
var Todo = mongoose.model('Todo', {
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

module.exports = {
  Todo: Todo
}
