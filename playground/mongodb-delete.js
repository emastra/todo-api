// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, function(err, client) {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then(function(result) {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'test'}).then(function(result) {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOne({completed: false}).then(function(result) {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Emiliano'}).then(function(res) {
  //   console.log(res);
  // });
  // db.collection('Users').findOneAndDelete({_id: new ObjectID('5b5ec25749c1d70eb63b5c11')}).then((res) => {
  //   console.log(res);
  // });

  //client.close();
});
