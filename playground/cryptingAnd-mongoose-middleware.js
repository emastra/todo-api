// https://www.npmjs.com/package/bcryptjs
var bcrypt = require('bcryptjs');

var password = 'abc123!';

// 1st arg: number of rounds to generate the salt
bcrypt.genSalt(10, function(err, salt) {
  bcrypt.hash(password, salt, function(err, hash) {
    // hash its what we wanna store inside the db
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$erlf0ToKRxmkSdF1JQBL/e53C98vDlAjoXE.ys7zWO4cbzNXGKEjq';

bcrypt.compare(password, hashedPassword, function(err, res) {
  // res is a boolean sayng if the two are identical
  console.log(res);
});

/*
HASHING WILL BE DONE WITH MONGOOSE MIDDLEWARE
https://mongoosejs.com/docs/middleware.html

Serial

Serial middleware functions are executed one after another, when each middleware calls next.

// We attach an event to the Schema
// pre run the code before the event, the event here is 'save'
// then call next() and the stuff is saved to the db

var schema = new Schema(..);
schema.pre('save', function(next) {
  // do stuff
  next();
});

*/
