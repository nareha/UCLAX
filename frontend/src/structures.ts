/**
 *Types and Enums used in frontend classes.
 *@module
 */

/**
 * Set of possible departure and destination locations for UC LAX users
 */
export enum Location {
/** LAX Airport */
    LAX = "LAX",
    UCLA = "UCLA",
/** Burbank Airport */
    BUR = "BUR"
  }

/**
 * Contains fields of a UC LAX user database submission
 */
export type Submission = {
    userid: number;
    /** Earliest departure time */
    interval_start: Date;
    /** Latest departure time */
    interval_end: Date;
    /** Departure location */
    source: Location;
    destination: Location;
    /** Contact info */
    contact: string;
    max_group_size?: number;
};
