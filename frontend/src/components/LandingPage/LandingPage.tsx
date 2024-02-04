import React from 'react';
import axios from 'axios';

const apiCall = () => {
  axios.get('http://localhost:9000').then((data) => {
    console.log(data.data)
  })
}

const LandingPage: React.FC = () => {
  return (
    <div>
      <button onClick={apiCall}>Get a message from Mickey!</button>
    </div>
  );
}

export default LandingPage;
