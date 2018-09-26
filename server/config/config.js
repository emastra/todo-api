// if we are in production or test NODE_ENV is gonna exist, if in development not, so we default to "development"
var env = process.env.NODE_ENV || 'development';
console.log('* You are in ***', env, '*** environment *');
  
// now we can set up our environment variables based on the environment we are in
if (env = 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env = 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
