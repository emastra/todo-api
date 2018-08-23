// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log('self created object id', obj);
console.log(obj.getTimestamp());

// the callback is passed a database client instance, from which all database commands are executed.
// From v3 the callback receive a client arg instead of db arg. then we need to connect to db with client.db.
MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, function(err, client) {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, function(err, result) {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, null, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Emiliano',
  //   age: 37,
  //   location: 'Chiang Mai'
  // }, function(err, result) {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, null, 2));
  // });

  // db.collection('Users').find({}, function(err, result) {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(result);
  // });

  // db.collection('Users').insertOne({
  //   name: 'Emiliano',
  //   age: 37,
  //   location: 'Chiang Mai'
  // }, function(err, result) {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   // hardcoded inside the object id there is the timestamp (1st byte I think...)
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Emiliano',
  //   age: 37,
  //   location: 'Chiang Mai',
  //   _id: new ObjectID(123)
  // }, function(err, result) {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops));
  // });


  // the close method is on the client obj and not on the db obj
  client.close();
});
