/**
 *Home and starting page of the App.
 *@module components/LandingPage
 */
import React, { useState } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { createTheme, ThemeProvider, Typography, Button } from '@mui/material';

import FailToast from '../FailToast/FailToast';
import logo from './logo.png';
import './LandingPage.css';

/** User's current verification status. */
export interface Verification {
  isVerified: boolean;
  /** Updates the user's verification status */
  verify: () => void;
}

//Theme used to format the Landing Page UI
const theme = createTheme({
  typography: {
    allVariants: {
      color: getComputedStyle(document.querySelector(':root')!).getPropertyValue('--text')
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

/**
 * Adds the user to the database based on their email address 
 * 
 * @param user_email The user's email, as a string
 * @returns The user's id as a Number
 */
export const addUser = async (user_email: string): Promise<number> => {
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

/** @ignore */
const LandingPage: React.FC<Verification> = ({verify, isVerified}: Verification) => {
  //states used to show error alerts
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  //format of user info retrieved from google login
  let userInfo = {
    email:"",
    email_verified:"",
    hd:"",
    name:""
  }
  
  const googleLogin = useGoogleLogin ({
    onSuccess: async tokenResponse => {
      // Fetching userInfo can be done on the client or the server
      userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);
      
      console.log(userInfo);

      //if the user does not have an email, or has an unverified one, or does not have a name, give an error alert
      if (!('email' in userInfo) || !('email_verified' in userInfo) || !('name' in userInfo) ){ 
        setAlertText("Unable to login with this account");
        setShowAlert(true);
        return;
      }

      //hd must have value g.ucla.edu in order for user to sign in
      if (!('hd' in userInfo) ){
        setAlertText("User must sign in with UCLA email");
        setShowAlert(true);
        return;
      }

      console.log(userInfo.email)
      //user must have verified email
      if (!userInfo.email_verified) {
        setAlertText("Email is not verified");
        setShowAlert(true);
        return;
      }

      //hd must have value g.ucla.edu in order for user to sign in
      if (userInfo.hd !== "g.ucla.edu") {
        setAlertText("Not a UCLA Email");
        setShowAlert(true);
        return;
      }

      verify();

      const userIdPromise = addUser(userInfo.email);
      userIdPromise.then((result) => {
        localStorage.setItem("userId", result.toString());
      });
    },
    onError: () => {
      setAlertText("Login failed, please try again.");
      setShowAlert(true);
      return;
    }
  });

  return (
    <>
      <FailToast alertType="Login Error" showAlert={showAlert} failMessage={alertText} closeAlert={() => {setShowAlert(false)}} />
      <ThemeProvider theme={theme}>
        <div className="elems">
          <img src={logo} alt="UC LAX Logo" style={{width: "100%", height: "auto", maxWidth: "350px"}} />
          <div>  
              {isVerified
                ?
                  <>
                    <Typography variant="subtitle1">
                      Verified! Start moving by navigating to the other pages.               
                    </Typography>
                  </>
                :
                  <>
                    <Typography variant="subtitle1">
                      Verify to start moving               
                    </Typography>
                    <Button variant="contained" onClick={() => googleLogin()}>Login with UCLA Gmail</Button>
                  </>
              }
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default LandingPage;
