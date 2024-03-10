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

export async function addUser(email: string): Promise<[string, Number | undefined]> {
  console.log("Checking if user is already in db");

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return [`This user already exists with an id of ${existingUser.user_id}.`, existingUser.user_id];
  }

  console.log("User not in db, adding");
  const insertUserQuery = 'INSERT INTO users (email) VALUES (?) RETURNING user_id';
  try {
    const row = await new Promise<any>((resolve, reject) => {
      db.get(insertUserQuery, [email], function(err, row) {
        if (err) reject(err);
        else resolve(row as Number);
      });
    });
    return [`User with email ${email} has been added to the database.`, row.user_id];
  } catch (error) {
    console.error('Error adding user:', error);
    return ['Error adding user to the database.', -1];
  }
}

/**
 * Adds new submission to the submissions table if the values submitted are valid.
 * 
 * @param submission the submission to be added to the table
 */
export async function addSubmission(submission: Submission): Promise<Number> {
  // check for erroneous inputs, throw error if found
  if (submission.interval_start > submission.interval_end) {
    throw new Error("Invalid start and end times.");
  }

  // try to update the user's submission first. if it doesn't
  // exist, insert a new row instead
  const rowsUpdated = new Promise<number>((resolve, reject) => {
    db.run("UPDATE submissions SET early_time = ?, late_time = ?, \
      source = ?, destination = ?, contact = ?, max_group_size = ?\
      WHERE user_id = ?",
      [submission.interval_start, submission.interval_end, submission.source, submission.destination, submission.contact, submission.max_group_size, submission.userid],
      function (err) {
        if (err) {
          reject(err);
        } else {
          console.log(`Updated submission for user ${submission.userid}, ${this.changes} rows affected.`);
          resolve(this.changes);
        }
      }
    );
  });

  await rowsUpdated.then((rowsChanged) => {
    if (rowsChanged === 0) {
      const insertStmt = db.prepare(`INSERT INTO submissions(user_id, early_time, \
        late_time, source, destination, contact, max_group_size) \
        VALUES (?, ?, ?, ?, ?, ?, ?)`);
      insertStmt.run(submission.userid, submission.interval_start,
        submission.interval_end, submission.source, submission.destination,
        submission.contact, submission.max_group_size);
      insertStmt.finalize();
      console.log('Inserted new row for user ', submission.userid);
    }
  });
  return new Promise<number>((resolve, reject) => {resolve(1)});
}

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

export function querySubmissionsAndEmails(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let queryString: string = 'SELECT * FROM submissions JOIN users on submissions.user_id = users.user_id';
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

export function getEmail(user_id: Number): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let queryString: string = 'SELECT * FROM users WHERE user_id = ? LIMIT 1';
    db.all(queryString, user_id, (err: Error | null, rows: Array<string>) => {
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