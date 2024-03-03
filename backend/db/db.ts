import { type Submission, type User } from "../src/structures";
import sqlite3 from 'sqlite3';

// open the db
const db = new sqlite3.Database('./rideshare.db', (err: Error | null) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the rideshare database.');
  }
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

/**
 * Closes the DB connection.
 */
export function closeDB() {
  // close the db
  db.close((err: Error | null) => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  });
}

async function findUserByEmail(email: string): Promise<User | null> {
  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  try {
    const row = await new Promise<User | null>((resolve, reject) => {
      db.get(query, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row as User | null);
      });
    });
    return row;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Database error occurred.');
  }
}

export async function addUser(email: string): Promise<string> {
  console.log("Checking if user is already in db");

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return `This user already exists with an id of ${existingUser.user_id}.`;
  }

  console.log("User not in db, adding");
  const insertUserQuery = 'INSERT INTO users (email) VALUES (?)';
  try {
    await new Promise<void>((resolve, reject) => {
      db.run(insertUserQuery, [email], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
    return `User with email ${email} has been added to the database.`;
  } catch (error) {
    console.error('Error adding user:', error);
    return 'Error adding user to the database.';
  }
}

/**
 * Adds new submission to the submissions table if the values submitted are valid.
 * 
 * @param submission the submission to be added to the table
 */
export function addSubmission(submission: Submission) {
  // check for erroneous inputs, throw error if found
  if (submission.interval_start > submission.interval_end) {
    throw new Error("Invalid start and end times.");
  }

  // prepare and run the statement
  let stmt = db.prepare(`INSERT INTO submissions(user_id, early_time, \
    late_time, source, destination, contact, max_group_size) \
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(submission.userid, submission.interval_start,
    submission.interval_end, submission.source, submission.destination,
    submission.contact, submission.max_group_size);
  stmt.finalize();
}

// TODO(joycetung): implement filtering support.
/**
 * Queries the submission table and returns all results
 * 
 * @returns the table's rows as an Array with elements of type Submission.
 */
export function querySubmissions(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let queryString: string = 'SELECT * FROM submissions';
    db.all(queryString, (err: Error | null, rows: Array<string>) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.log("Received: ", rows);
        resolve(rows);
      }
    });
  });
}
