import React from 'react';
import axios from 'axios';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import './LandingPage.css';

const apiCall = () => {
  axios.get('http://localhost:9000').then((data) => {
    console.log(data.data);
  })
}

enum Destination {
  LAX = "LAX",
  UCLA = "UCLA"
}

type Submission = {
  interval_start: Date;
  interval_end: Date;
  destination: Destination;
  contact: string;
};

const postCall = () => {
  // Example data - random interval_start, interval_end, destination, and contact
  const submissionData : Submission= {
    interval_start: new Date('2024-02-10T09:00:00Z'),
    interval_end: new Date('2024-02-10T10:00:00Z'),
    destination: Destination.LAX,
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
  let loggedIn = false;
  let userInfo = {email:"", email_verified:"", hd:"", name:""}
  
  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      // fetching userinfo can be done on the client or the server
      userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);
      
      console.log(userInfo);
      if (!('email' in userInfo) || !('email_verified' in userInfo) || !('name' in userInfo)  ){ 
        throw new Error('Unable to login with this account');
      }
      if (!('hd' in userInfo) ){
        throw new Error('User must sign in with UCLA email');
      }

      loggedIn = true;

      console.log(userInfo.email)
      if(!userInfo.email_verified){
        throw new Error('Email is not verified');
      }
      if(userInfo.hd != "g.ucla.edu"){
        throw new Error('Not a UCLA Email');
      }
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
            <p>Verify to start moving</p>
            <h1>
            <button onClick={() => googleLogin()}>Sign in with Google </button>
            </h1>
        </div>
      </div>

      <button onClick={apiCall}>Get a message from Mickey!</button>
      <button onClick={postCall}>Send a sample message to Mickey!</button>
    </div>
  );
}

export default LandingPage;
