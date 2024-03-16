/**
 *Links all frontend components together.
 *@module
 */
import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import RidesharersPage from './components/RidesharersPage/RidesharersPage';
import SubmissionPage from './components/SubmissionPage/SubmissionPage';
import NotFoundPage from './components/404Page/404Page';

/** @ignore */
const App: React.FC = () => {
  //changes state based on whether the user has been verified through Google Sign-In
  const [isVerified, setIsVerified] = useState<boolean>(false);

  //used to updated user's verified status in real-time
  const handleIsVerified = useCallback(() => {
    setIsVerified(true);
  }, []);
  
  //The class returns a Navbar when the user is verified, and also returns routes to various pages based on the user's verified status.
  //GoogleOauthProvider is used to allow the user to sign-in with google through a GCP project.
  return (
    <>
      <GoogleOAuthProvider clientId="855516960445-ue7h075jd8jcp9jukvtbgd235sr29q27.apps.googleusercontent.com">
        <Navbar isVerified={isVerified} />
        <Routes>
  	      <Route path="/" element={<LandingPage isVerified={isVerified} verify={handleIsVerified} />} />
          <Route path="/ridesharers" element={isVerified ? <RidesharersPage /> : <Navigate to="/" />} />
          <Route path="/submit" element={isVerified ? <SubmissionPage /> : <Navigate to="/" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
