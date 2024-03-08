import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

import {Location, Submission} from '../../structures';

import LoginFailToast from '../LoginFailToast/LoginFailToast';
import './LandingPage.css';

const apiCall = () => {
  axios.get('http://localhost:9000').then((data) => {
    console.log(data.data);
  })
}

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

const addUserEx = () => {
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

const addUser = async (user_email: string): Promise<number> => {
  let userid: number = -1;
  await axios.post('http://localhost:9000/user', {email: user_email})
    .then(response => {
      console.log(response.data[0]);
      console.log(response.data[1]);
      userid = response.data[1];
    })
    .catch(error => {
      console.error('Error adding user:', error);
      console.log("Your request was: ", {email: user_email});
    });
  return userid;
}

interface Verification {
  isVerified: boolean;
  verify: () => void;
}


const LandingPage: React.FC<Verification> = ({verify, isVerified}: Verification) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [userId, setUserId] = useState(-1);

  useEffect(() => {
    localStorage.setItem("userId", userId.toString());
  }, [userId]);

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
        setAlertText("Unable to login with this account");
        setShowAlert(true);
        return;
      }
      if (!('hd' in userInfo) ){
        setAlertText("User must sign in with UCLA email");
        setShowAlert(true);
        return;
      }

      console.log(userInfo.email)
      if (!userInfo.email_verified) {
        setAlertText("Email is not verified");
        setShowAlert(true);
        return;
      }
      if (userInfo.hd !== "g.ucla.edu") {
        setAlertText("Not a UCLA Email");
        setShowAlert(true);
        return;
      }

      verify();

      const userIdPromise = addUser(userInfo.email);
      userIdPromise.then((result) => {
        setUserId(result);
      });
    },
    onError: errorResponse => {
      setAlertText("Login failed, please try again.");
      setShowAlert(true);
      return;
    }
  });
  return (
    <div>
      <LoginFailToast showAlert={showAlert} failMessage={alertText} closeAlert={() => {setShowAlert(false)}} />
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
      <button onClick={addUserEx}>Add Mickey as a user to the database!</button>
    </div>
  );
}

export default LandingPage;
