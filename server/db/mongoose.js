var mongoose = require('mongoose');

// mongoose configuration
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

// exports mongoose. Requiring this file, you get mongoose configured and get back mongoose var.
module.exports = {
  mongoose: mongoose
}
