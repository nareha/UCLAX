import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

import type { Submission } from "./structures";

export function formatDate(dateObject: Date) {
    const options : DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles'
    };

    const formattedDate = dateObject.toLocaleString('en-US', options);
    return formattedDate;
}

export function scanMatches(submission: Submission, table: Submission[]): Submission[] {
    // two submisions match if they have matching sources and destinations AND
    // their leave intervals overlap
    const matches = table.filter((row) => {
      // Detect overlap: sort the compared intervals by earliest start, and if
      // the earliest interval's end exceeds the latest intervals start, they overlap.
      let earliestInterval: [Date, Date] = [row.interval_start, row.interval_end];
      let latestInterval: [Date, Date] = [submission.interval_start, submission.interval_end];
      if (earliestInterval[0] > latestInterval[0]) {
        [earliestInterval, latestInterval] = [latestInterval, earliestInterval];
      }
      let intervalOverlap = earliestInterval[1] > latestInterval[0];
  
      return row["source"] == submission["source"] &&
        row["destination"] == submission["destination"] && intervalOverlap;
    });
    return matches;
  } 
