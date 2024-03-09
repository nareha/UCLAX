import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';

import InfoBox, { Info } from '../InfoBox/InfoBox';
import { getSupportedCodeFixes } from 'typescript';

const RidesharersPage: React.FC = () => {
  const [ridesharers, setRidesharers] = useState<Info[]>([]);
  const [processedRidershares, setProcessedRidershares] = useState<Info[]>([]);
  
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
  
  const tempDate: string = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const date1: string =  new Date('March 9, 2024 01:30:00').toLocaleString(); 
  const date2: string =  new Date('March 9, 2024 02:30:00').toLocaleString();
  const date3: string =  new Date('March 9, 2024 03:30:00').toLocaleString();
  const date4: string =  new Date('March 9, 2024 04:30:00').toLocaleString();
  const date5: string =  new Date('March 9, 2024 10:30:00').toLocaleString();
  const date6: string =  new Date('March 9, 2024 16:30:00').toLocaleString();
  const date7: string =  new Date('March 9, 2024 18:30:00').toLocaleString();
  const tempRidesharers: Array<Info> = [
    {
      contact: "Instagram @mickeymouse",
      source: "UCLA",
      destination: "LAX",
      early_time: date1,
      late_time: date2
    },
    {
      contact: "Phone (555) 555-5555",
      source: "BUR",
      destination: "UCLA",
      early_time: date2,
      late_time: date3
    },
    {
      contact: "Email midnightrider@gmail.com",
      source: "BUR",
      destination: "UCLA",
      early_time: date1,
      late_time: date4
    },
    {
      contact: "Email gertrude@pm.me",
      source: "LAX",
      destination: "UCLA",
      early_time: date4,
      late_time: date5,
      maxParty: 5
    },
    {
      contact: "Instagram @bruwuins",
      source: "UCLA",
      destination: "BUR",
      early_time: date5,
      late_time: date7
    }
  ];

  // export interface Info {
  //   contact: string;
  //   source: "UCLA" | "LAX" | "BUR";
  //   destination: "UCLA" | "LAX" | "BUR";
  //   early_time: string;
  //   late_time: string;
  //   maxParty?: number;
  // }

  // tempRidesharers.sort(reverse=True, key = lambda x: x[N])
  // const idk = sorted(tempRidesharers, key=lambda tup: tup[1])
  const filterRides = () => {
    const sources = (document.getElementById("source") as HTMLSelectElement);
    const selectedSources = Array.from(sources.options).filter(function (option) {
      return option.selected;
    }).map(function (option) {
      return option.value;
    });

    const dest = (document.getElementById("dest") as HTMLSelectElement);
    const selectedDests = Array.from(dest.options).filter(function (option) {
      return option.selected;
    }).map(function (option) {
      return option.value;
    });

    console.log(selectedSources);
    console.log(selectedDests);
    console.log(tempRidesharers)
    const filtered = tempRidesharers.filter(({source, destination}) => selectedSources.includes(source) && selectedDests.includes(destination));
    console.log(filtered)
    setProcessedRidershares(filtered);
    console.log(processedRidershares)
    // updateGrid(filtered);
  }

  const sortRides = () => {
    
  }

  const resetGrid = () => {
    setProcessedRidershares(tempRidesharers)
  }

  const updateGrid = (ridesharers : Info[]) => {
    return ridesharers.map(({ contact, source, destination, early_time, late_time, maxParty }) => (
      <Grid style={{ display: 'flex' }} item xs={12} md={6} lg={4} key={contact}>
        <InfoBox
          contact={contact}
          source={source}
          destination={destination}
          early_time={early_time}
          late_time={late_time}
          maxParty={maxParty}
        />
      </Grid>
    ));
  }

  return (
    <div> 
      <div>
        <form>
          <label>Filter by Source: </label>
          <select id="source" multiple>
            <option value="LAX" selected>LAX</option>
            <option value="UCLA" selected>UCLA</option>
            <option value="BUR" selected>BUR</option>
          </select>

          <label>Filter by Dest: </label>
          <select id="dest" multiple>
            <option value="LAX" selected>LAX</option>
            <option value="UCLA" selected>UCLA</option>
            <option value="BUR" selected>BUR</option>
          </select>
          <input type="reset" value="Reset" onClick={resetGrid}/>
        </form>
        <button onClick={filterRides}>Filter</button>
      </div>
      <div>
        <form>
          <label>Sort By: </label>
          <select id="sort" >
            <option value="early">Early Time</option>
            <option value="late">Late Time</option>
          </select>

          <label>Order: </label>
          <select id="order" >
            <option value="ascending">Ascending</option>
            <option value="descending">Descendinge</option>
          </select>
          <input type="reset" value="Reset" />
        </form>
        <button onClick={sortRides}>Sort</button>
      </div>
    <Grid style={{margin: "auto", width: "80%"}} container spacing={4}>
          {updateGrid(processedRidershares)}
    </Grid>
    </div>
  );
}

export default RidesharersPage;
