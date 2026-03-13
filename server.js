const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Suppress MongoDB driver deprecation warning
process.removeAllListeners('warning');
process.on('warning', warning => {
  if (
    warning.name === 'DeprecationWarning' &&
    warning.message.includes('MongoDB')
  ) {
    return;
  }
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE.replace(
        '<PASSWORD>',
        encodeURIComponent(process.env.DATABASE_PASSWORD)
      )
    : process.env.DATABASE_LOCAL || 'mongodb://localhost:27017/natours';

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

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
