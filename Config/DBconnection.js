const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME
};

// Create the connection
const mydb = mysql.createConnection(dbConfig);

// Connect to the database
mydb.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Export the connection
module.exports = mydb;