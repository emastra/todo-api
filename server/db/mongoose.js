var mongoose = require('mongoose');

// mongoose configuration
mongoose.Promise = global.Promise; // use the standard JS promises ?
// heroku uses mongolab which has a url to connect to. heroku config cmd shows the uri which mongolab provided to us. the variable is on process.env...
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });  // we dont need anymore the default (using "||") because MONGODB_URI will always be set, in prob by herouku and in dev and test in the config 

// exports mongoose. Requiring this file, you get mongoose configured and get back mongoose var.
module.exports = {
  mongoose: mongoose
}
