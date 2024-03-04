import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';

import InfoBox, { Info } from '../InfoBox/InfoBox';

const RidesharersPage: React.FC = () => {
  const [ridesharers, setRidesharers] = useState<Info[]>([]);

  const getRidesharers = () => {
    axios
      .get('http://localhost:9000/table')
      .then((data) => {
        setRidesharers(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getRidesharers();
  }, [])

  return (
    <Grid style={{margin: "auto", width: "80%"}} container spacing={4}>
      {ridesharers.map(({contact, source, destination, early_time, late_time, maxParty}) => 
        <Grid style={{display: 'flex'}} item xs={12} md={6} lg={4}>
          <InfoBox
            contact={contact}
            source={source}
            destination={destination}
            early_time={early_time}
            late_time={late_time}
            maxParty={maxParty}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default RidesharersPage;
