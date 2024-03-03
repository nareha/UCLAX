import React from 'react';
import axios from 'axios';

import { useGoogleLogin } from '@react-oauth/google';

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

const addUser = () => {
  const payload = {
    email: "mick@ucla.edu"
  };
  
  axios.post('http://localhost:9000/user', payload)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error adding user:', error);
    });
}

interface Verification {
  isVerified: boolean;
  verify: () => void;
}

const LandingPage: React.FC<Verification> = ({verify, isVerified}: Verification) => {
  let userInfo = {
    email:"",
    email_verified:"",
    hd:"",
    name:""
  }
  
  const googleLogin = useGoogleLogin ({
    onSuccess: async tokenResponse => {
      // fetching userinfo can be done on the client or the server
      userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);
      
      console.log(userInfo);
      if (!('email' in userInfo) || !('email_verified' in userInfo) || !('name' in userInfo) ){ 
        throw new Error('Unable to login with this account');
      }
      if (!('hd' in userInfo) ){
        throw new Error('User must sign in with UCLA email');
      }

      console.log(userInfo.email)
      if (!userInfo.email_verified) {
        throw new Error('Email is not verified');
      }
      if (userInfo.hd !== "g.ucla.edu") {
        throw new Error('Not a UCLA Email');
      }

      verify();
    },
    onError: errorResponse => console.log(errorResponse)
  });
  return (
    <div>
      <div className="elems">
        <div className="title-text">
          <h1>UC LAX</h1>
        </div>
        <div className="description">  
            {!isVerified && 
              <>
              <p>Verify to start moving</p>
              <button onClick={ () => googleLogin() }>Sign in with Google</button>
              </>
            }
        </div>
      </div>

      <button onClick={apiCall}>Get a message from Mickey!</button>
      <button onClick={postCall}>Send a sample message to Mickey!</button>
      <button onClick={addUser}>Add Mickey as a user to the database!</button>
    </div>
  );
}

export default LandingPage;
