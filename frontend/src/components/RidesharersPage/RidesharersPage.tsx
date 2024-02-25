import React from 'react';
import Grid from '@mui/material/Grid';

import InfoBox, { Info } from '../InfoBox/InfoBox';

// Placeholder date string used by tempRidesharers; to be replaced with true user information
const tempDate: string = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

// Placeholder values; to be replaced by retrieving true user information
const tempRidesharers: Array<Info> = [
  {
    contact: "Instagram @mickeymouse",
    source: "UCLA",
    destination: "LAX",
    intervalStart: tempDate,
    intervalEnd: tempDate
  },
  {
    contact: "Phone (555) 555-5555",
    source: "BUR",
    destination: "UCLA",
    intervalStart: tempDate,
    intervalEnd: tempDate
  },
  {
    contact: "Email midnightrider@gmail.com",
    source: "BUR",
    destination: "UCLA",
    intervalStart: tempDate,
    intervalEnd: tempDate
  },
  {
    contact: "Email gertrude@pm.me",
    source: "LAX",
    destination: "UCLA",
    intervalStart: tempDate,
    intervalEnd: tempDate,
    maxParty: 5
  },
  {
    contact: "Instagram @bruwuins",
    source: "UCLA",
    destination: "BUR",
    intervalStart: tempDate,
    intervalEnd: tempDate
  }
];

const RidesharersPage: React.FC = () => {
  return (
    <Grid style={{margin: "auto", width: "80%"}} container spacing={4}>
      {tempRidesharers.map(({contact, source, destination, intervalStart, intervalEnd, maxParty}) => 
        <Grid style={{display: 'flex'}} item xs={12} md={6} lg={4}>
          <InfoBox
            contact={contact}
            source={source}
            destination={destination}
            intervalStart={intervalStart}
            intervalEnd={intervalEnd}
            maxParty={maxParty}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default RidesharersPage;
