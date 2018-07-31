// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, function(err, client) {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Users').insertOne({
  //   name: 'Emiliano',
  //   age: 37,
  //   location: 'Chiang Mai'
  // }).then(function(res) {
  //   console.log(res);
  // });

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5b5ed1bf27cfe02662517e93')
  // }, {
  //   $set: {completed: true}
  // }, {
  //   returnOriginal: false
  // }).then(function(res) {
  //   console.log(res);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b600fb134381319eca3571c')
  }, {
    $set: {name: 'Mike'},
    $inc: {age: 1}
  }, {
    returnOriginal: false
  }).then(function(res) {
    console.log(res);
  }, function(err) {
    console.log(err);
  });

  //client.close();
});
