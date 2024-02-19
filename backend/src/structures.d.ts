export enum Location {
    LAX = "LAX",
    UCLA = "UCLA",
    BUR = "BUR"
  }
  
export type Submission = {
    userid: number;
    interval_start: Date;
    interval_end: Date;
    source: Location;
    destination: Location;
    contact: string;
    max_group_size?: number;
};
