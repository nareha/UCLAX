import type { Submission } from "../src/structures";

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
export function querySubmissions(): Array<Submission> {
  let queryString : string = 'SELECT * FROM submissions';
  let submissionRows: Array<Submission> = [];
  db.all(queryString, (err: Error | null, rows: Array<string>) => {
    if (err) {
      console.error(err.message);
    }
    submissionRows = rows.map(function(rowStr: string):Submission{
      let submissionRow:Submission = JSON.parse(rowStr);
      return submissionRow;
    });
  });
  return submissionRows;
}
