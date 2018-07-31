// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, function(err, client) {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').find().toArray().then(function(docs) {
  //   console.log(docs);
  // }, function(err) {
  //   console.log('Unable to fetch Todos', err);
  // });

  // var cursor = db.collection('Todos').find();

  // console.log(cursor.toArray()); // toArray without a callback returns a promise

  // cursor.toArray(function(err, docs) {
  //   if (err) return console.log('Error while toArray the cursor', err)
  //   console.log(docs);
  // });

  // cursor.toArray().then(function(docs) {
  //   console.log(docs);
  // }, function(err) {
  //   console.log('Error while toArray the cursor', err);
  // });

  // db.collection('Todos').find({completed: false}).toArray().then(function(docs) {
  //   console.log(docs);
  // }, function(err) {
  //   console.log('Error while toArray the cursor', err);
  // });

  // db.collection('Todos').find({completed: false}).count().then(function(count) {
  //   console.log('Number of todos:', count);
  // }, function(err) {
  //   console.log('Error while count() the cursor', err);
  // });

  var collection = db.collection('Users');
  collection.find({name: 'Emiliano'}).toArray().then(function(result) {
    console.log(result);
  }, function(error) {
    console.log(error);
  })



  //client.close();
});
