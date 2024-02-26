import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

// Interval start & end expect the Date object to already be converted to a string
export interface Info {
  contact: string;
  source: "UCLA" | "LAX" | "BUR";
  destination: "UCLA" | "LAX" | "BUR";
  intervalStart: string;
  intervalEnd: string;
  maxParty?: number;
}

const InfoBox: React.FC<Info> = ({contact, source, destination, intervalStart, intervalEnd, maxParty}: Info) => {
  return (
    <Card>
      <CardContent style={{wordWrap: "break-word"}}>
        <Typography>
          Contact Info: {contact} 
        </Typography>
        <Typography>
          Going from {source} to {destination}
        </Typography>
        <Typography>
          Arrival Time: {intervalStart} - {intervalEnd}
        </Typography>
        {maxParty &&
          <Typography>
            Max Party of {maxParty}
          </Typography>
        }
      </CardContent>
    </Card>
  );
}

export default InfoBox;
