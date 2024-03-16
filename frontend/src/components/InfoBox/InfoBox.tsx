/**
 *Box UI displaying a user's info on Ridesharers page.
 *@module components/InfoBox
 */
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

// early_time and late_time expect the Date object to already be converted to a string
/** Contains user's info to be displayed in boxes. */
export interface Info {
  /** Contact Info*/
  contact: string;
  /** Departure Location*/
  source: "UCLA" | "LAX" | "BUR";
  destination: "UCLA" | "LAX" | "BUR";
  /** Earliest departure time */
  early_time: string;
  /** Latest departure time */
  late_time: string;
  max_group_size?: number;
}

const headingColor = getComputedStyle(document.querySelector(':root')!).getPropertyValue('--main');
const HeadingText: React.FC<{ text: string }> = ({text}: {text : string}) => <span style={{color: `${headingColor}`, fontWeight: "bold"}}>{text}</span>

/** @ignore */
const InfoBox: React.FC<Info> = ({contact, source, destination, early_time, late_time, max_group_size}: Info) => {
  return (
    <Card>
      <CardContent style={{wordWrap: "break-word"}}>
        <Typography>
          <HeadingText text="Contact Info: " />
          {contact} 
        </Typography>
        <Typography>
          <HeadingText text="Going from " />
          {source}
          <HeadingText text=" to " />
          {destination}
        </Typography>
        <Typography>
          <HeadingText text="Depart between " />
          {early_time}
          <HeadingText text=" and " />
          {late_time}
        </Typography>
        {max_group_size &&
          <Typography>
            <HeadingText text="Max Group Size of " />
            {max_group_size}
          </Typography>
        }
      </CardContent>
    </Card>
  );
}

export default InfoBox;
