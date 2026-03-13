const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// Define your MongoDB connection URI (use environment variables for security in production)

//MongoDB configuration
const { DATABASE } = process.env;

mongoose.connect(DATABASE);
const conn = mongoose.connection;
conn.once('open', () => {
  console.log('Succesfully connected to database');
});
conn.on('error', () => {
  console.log('error to connect to database');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
