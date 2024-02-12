const sqlite3 = require('sqlite3').verbose();

// open the db
let db = new sqlite3.Database('./rideshare.db', sqlite3.OPEN_CREATE, (err: { message: any; }) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the rideshare database.');
});

// init
db.serialize(() => {
  // Set foreign keys on first
  db.get("PRAGMA foreign_keys = ON");
  // Create the tables, if they don't exist.
  db.exec(`CREATE TABLE IF NOT EXISTS users(
          user_id INTEGER PRIMARY KEY ASC,
          email TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS submissions(
          submission_id INTEGER PRIMARY KEY ASC,
          user_id INTEGER NOT NULL,
          early_time INTEGER NOT NULL,
          late_time INTEGER NOT NULL,
          source TEXT NOT NULL,
          destination TEXT NOT NULL,
          contact TEXT NOT NULL,
          max_group_size INTEGER,
          FOREIGN KEY(user_id) REFERENCES users(user_id)
        );`);
});


// close the db
db.close((err: { message: any; }) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});