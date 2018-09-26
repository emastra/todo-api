// config variables must not be part of the repo!! this file will instead! config.json is ignored instead!
// only prod and test environment variables are configured locally via the config files, prod envs are configured via heroku cmd line or heroku web app

// if we are in production or test NODE_ENV is gonna exist, if in development not, so we default to "development"
var env = process.env.NODE_ENV || 'development';
console.log('* You are in ***', env, '*** environment *');

// in config.json we specify any local environemnt variables
if (env === 'development' || env === 'test') {
  // when require a json file it automatically parse it in a js object
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach(function(key) {
    process.env[key] = envConfig[key];
  });
}


// old way to config!!!!
// // now we can set up our environment variables based on the environment we are in
// if (env = 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env = 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
