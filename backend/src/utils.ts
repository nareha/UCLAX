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

export function scanMatches(submission: Submission, table: any[]): Submission[] {
    // two submisions match if they have matching sources and destinations AND
    // their leave intervals overlap
    const matches = table.filter((row) => {
      // Detect overlap: sort the compared intervals by earliest start, and if
      // the earliest interval's end exceeds the latest intervals start, they overlap.
      console.log("Row ", row);
      let earliestInterval: [Date, Date] = [new Date(row.early_time), new Date(row.late_time)];
      let latestInterval: [Date, Date] = [new Date(submission.interval_start), new Date(submission.interval_end)];
      if (earliestInterval[0] > latestInterval[0]) {
        [earliestInterval, latestInterval] = [latestInterval, earliestInterval];
      }
      console.log("[early_interval, late_interval] = ", earliestInterval, latestInterval);
      let intervalOverlap = earliestInterval[1] >= latestInterval[0];
  
      return row["source"] == submission["source"] &&
        row["destination"] == submission["destination"] && intervalOverlap &&
        row["user_id"] != submission["userid"];
    });
    return matches;
  } 
