const {SHA256} = require('crypto-js');

var message = 'I am user number 4';
// the result is an object, convert it to a string
// ONELINER: var hash = SHA256(message).toString();
var hashObj = SHA256(message);
var hash = hashObj.toString();


console.log(`Message: ${message}`);
console.log(`HashObj: ${hashObj}`);
console.log(`Hash: ${hash}`);

// hashing is a one-way algorythm, that is,
// given one string you'll always get back the same result but i cannot get the orgonal message back with that result

// data to send back to the client
var data = {
  id: 4
};
// to make sure the client doesnt manipulate the data before requeting anything to server
// instead we send a token to client, which includes the data, and the hash of the data
var token = {
  data,
  // hash value of the data. sha256 needs a string, sha256 returns a obj, so need to toString
  // token is not full proof. User mighnt change the data prop and re-hash it, so we need to "salt" the hash!
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};



// Man in the iddle eventual activity:
// change the data, re-hash it, send request with manipulated token to server
// MenInTheMInddle attack cannot work because he doesnt have the secret, which is only on the server
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();



// lets validate token was not manipulate
// resultHash stores the hash of the data that comes back, the data that may or may not have been manipulated
// we extrapolate the data from the token, stringify, add the same 'somesecret', pass it through SHA256, then make it a string.
var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// now we can do the comparison
if (resultHash === token.hash) {
  console.log('Data was not changed');
} else {
  console.log('Data was changed. Do not trust!');
}


// This all process of: creating an object, hash it and verify it later
// It's a standard, its called the Json Web Token
