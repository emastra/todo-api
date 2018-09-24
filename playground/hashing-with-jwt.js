// All that process of: creating an object, hash it and verify it later
// It's a standard, its called the Json Web Token

const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

// jwt.sign takes the obj (in our case the data with the objectID) and signs it, cioè creates the hash and returns the token
// jwt.verify this makes the opposite, it takes the token and the secret and make sure the token was not manipulated, returns the decoded data

// takes the obj (the data we wanna sign) and the secret, it returns the token, which is the alue we send to client and that we gonna store inside the token array inside the db
var token = jwt.sign(data, 'somesecret');

console.log(token);

// to take a look waht makes up the jwt token check jwt.io

// takes the token to verify and the same secret, returns the decoded data
var decoded = jwt.verify(token, 'somesecret123');

console.log('decoded:', decoded);

// if token is different or the secret is not correct, jwt.verify throw an error!
