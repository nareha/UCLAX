/**
 *Page displaying info boxes for all UC LAX Ridesharers.
 *Only available to logged in users.
 *@module components/RidesharersPage
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import InfoBox, { Info } from '../InfoBox/InfoBox';

const theme = createTheme({
  typography: {
    allVariants: {
      color: getComputedStyle(document.querySelector(':root')!).getPropertyValue('--text')
    },
    h2: {
      fontSize: 40,
      fontWeight: 500
    },
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: getComputedStyle(document.querySelector(':root')!).getPropertyValue('--main')
    }
  }
});

const MenuProps = {
  PaperProps: {
    style: {
      width: 200
    },
  },
};

/**@ignore */
const RidesharersPage: React.FC = () => {
  // All ridesharers and the actual displayed ridesharers
  const [ridesharers, setRidesharers] = useState<Info[]>([]);
  const [processedRidershares, setProcessedRidershares] = useState<Info[]>([]);
  
  // Filter and sorting states
  const [sources, setSources] = useState<string[]>(["UCLA", "LAX", "BUR"]);
  const [dests, setDests] = useState<string[]>(["UCLA", "LAX", "BUR"]);
  const [sortBy, setSortBy] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("");

  // On load, fetch all of the ridesharers
  useEffect(() => {
    axios
      .get('http://localhost:9000/table')
      .then((data) => {
        setRidesharers(data.data);
        setProcessedRidershares(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])

  // filterRides and sortRides use a hacky solution to have states properly synchronized
  const filterRides = (curSources: string[], curDests: string[], entries : Info[]) => {
    return entries.filter(({ source, destination }) => curSources.includes(source) && curDests.includes(destination));
  }

  const sortRides = (sortBySelect: string, sortOrdering: string, rides : Info[]) => {
    let sorted;

    if (sortBySelect === "Early Time") {
      sorted = rides.slice().sort((a, b) => (new Date(a.early_time).valueOf() - new Date(b.early_time).valueOf()));
    }
    else if (sortBySelect === "Late Time") {
      sorted = rides.slice().sort((a, b) => (new Date(a.late_time).valueOf() - new Date(b.late_time).valueOf()));
    } else {
      // If user has not yet made selection on sorting, we will display the data as is
      sorted = rides;
    }

    if (sortBySelect !== "" && sortOrdering === "") {
      // If they didn't select an ordering yet, we will default to ascending
      setOrdering("Ascending");
    }
    
    if (sortOrdering === "Descending") {
      sorted.reverse();
    }
    
    
    return sorted
  }

  //the below variables are used to change the ordering when the user changes the sorting and filtering methods
  const sourceChange = (event: SelectChangeEvent<typeof sources>) => {
    const resSources = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    setSources(resSources);
    setProcessedRidershares(sortRides(sortBy, ordering, filterRides(resSources, dests, ridesharers)));
  };

  const destChange = (event: SelectChangeEvent<typeof dests>) => {
    const resDests = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    setDests(resDests);
    setProcessedRidershares(sortRides(sortBy, ordering, filterRides(sources, resDests, ridesharers)));
  };

  const sortByChange = (event: SelectChangeEvent<typeof sortBy>) => {
    const newSortBy = event.target.value as string;
    setSortBy(newSortBy);
    setProcessedRidershares(sortRides(newSortBy, ordering, filterRides(sources, dests, ridesharers)));
  };

  const orderingChange = (event: SelectChangeEvent<typeof ordering>) => {
    const newOrdering = event.target.value as string;
    setOrdering(newOrdering);
    setProcessedRidershares(sortRides(sortBy, newOrdering, filterRides(sources, dests, ridesharers)));
  };

  //reset to default sorting and filtering
  const resetGrid = () => {
    setSources(["UCLA", "LAX", "BUR"]);
    setDests(["UCLA", "LAX", "BUR"]);
    setSortBy("");
    setOrdering("");
    setProcessedRidershares(ridesharers);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
      <div style={{margin: "auto", marginTop: "4rem", marginBottom: "2rem", width: "80%", textAlign: "center"}}>
        <Typography variant="h2" style={{marginBottom: "4rem"}}>
          Ridesharers
        </Typography>
        <div style={{display: "flex", justifyContent: "center", rowGap:"20px", columnGap: "10px", flexWrap: "wrap", marginBottom: "2rem"}}>
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Filter by Source</InputLabel>
              <Select
                autoWidth={true}
                multiple
                value={sources}
                onChange={sourceChange}
                input={<OutlinedInput label="Filter by Source" />}
                MenuProps={MenuProps}
              >
                  <MenuItem value={"UCLA"}>UCLA</MenuItem>
                  <MenuItem value={"LAX"}>LAX</MenuItem>
                  <MenuItem value={"BUR"}>BUR</MenuItem>
              </Select>
          </FormControl>
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Filter by Destination</InputLabel>
              <Select
                autoWidth={true}
                multiple
                value={dests}
                onChange={destChange}
                input={<OutlinedInput label="Filter by Destination" />}
                MenuProps={MenuProps}
              >
                  <MenuItem value={"UCLA"}>UCLA</MenuItem>
                  <MenuItem value={"LAX"}>LAX</MenuItem>
                  <MenuItem value={"BUR"}>BUR</MenuItem>
              </Select>
          </FormControl>
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Sort Times By</InputLabel>
              <Select
                autoWidth={true}
                value={sortBy}
                onChange={sortByChange}
                input={<OutlinedInput label="Sort Times By" />}
                MenuProps={MenuProps}
              >
                <MenuItem value={"Early Time"}>Early Time</MenuItem>
                <MenuItem value={"Late Time"}>Late Time</MenuItem>
              </Select>
          </FormControl>
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Order</InputLabel>
              <Select
                autoWidth={true}
                value={ordering}
                onChange={orderingChange}
                input={<OutlinedInput label="Order" />}
                MenuProps={MenuProps}
              >
                <MenuItem value={"Ascending"}>Ascending</MenuItem>
                <MenuItem value={"Descending"}>Descending</MenuItem>
              </Select>
          </FormControl>
        </div>
        <Button variant="contained" onClick={() => resetGrid()}>Reset Filters / Sort</Button>
      </div>
      <Grid style={{margin: "auto", width: "80%"}} container spacing={4}>
        {processedRidershares.map(({contact, source, destination, early_time, late_time, max_group_size}) => 
          <Grid style={{display: 'flex'}} item xs={12} md={6} lg={4}>
            <InfoBox
              contact={contact}
              source={source}
              destination={destination}
              early_time={early_time}
              late_time={late_time}
              max_group_size={max_group_size}
            />
          </Grid>
        )}
      </Grid>
    </ThemeProvider>
    </>
  );
}

export default RidesharersPage;
