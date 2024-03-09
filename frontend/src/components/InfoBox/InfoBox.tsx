import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

// Interval start & end expect the Date object to already be converted to a string
export interface Info {
  contact: string;
  source: "UCLA" | "LAX" | "BUR";
  destination: "UCLA" | "LAX" | "BUR";
  early_time: string;
  late_time: string;
  max_group_size?: number;
}

const InfoBox: React.FC<Info> = ({contact, source, destination, early_time, late_time, max_group_size}: Info) => {
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
          Arrival Time: {early_time} - {late_time}
        </Typography>
        {max_group_size &&
          <Typography>
            Max Party of {max_group_size}
          </Typography>
        }
      </CardContent>
    </Card>
  );
}

export default InfoBox;
