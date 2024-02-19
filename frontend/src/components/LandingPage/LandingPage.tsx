import React from 'react';
import axios from 'axios';

import './LandingPage.css';

const apiCall = () => {
  axios.get('http://localhost:9000').then((data) => {
    console.log(data.data);
  })
}

enum Location {
  LAX = "LAX",
  UCLA = "UCLA",
  BUR = "BUR"
}

type Submission = {
  userid: number;
  interval_start: Date;
  interval_end: Date;
  source: Location;
  destination: Location;
  contact: string;
  max_group_size?: number;
};

const postCall = () => {
  // Example data - random interval_start, interval_end, destination, and contact
  const submissionData : Submission = {
    userid: 1,
    interval_start: new Date('2024-02-10T09:00:00Z'),
    interval_end: new Date('2024-02-10T10:00:00Z'),
    source: Location.UCLA,
    destination: Location.LAX,
    contact: '@ChadJohnson'
  };

  axios.post('http://localhost:9000/submission', submissionData)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error posting submission:', error);
    });
}

const LandingPage: React.FC = () => {
  return (
    <div>
      <div className="elems">
        <div className="title-text">
          <h1>UC LAX</h1>
        </div>
        <div className="description">
            <p>Verify to start moving</p>
            <button>Log in with Google</button>
        </div>
      </div>

      <button onClick={apiCall}>Get a message from Mickey!</button>
      <button onClick={postCall}>Send a sample message to Mickey!</button>
    </div>
  );
}

export default LandingPage;
