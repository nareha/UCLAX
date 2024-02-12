export enum Destination {
    LAX = "LAX",
    UCLA = "UCLA"
  }
  
export type Submission = {
    interval_start: Date;
    interval_end: Date;
    destination: Destination;
    contact: string;
};
  