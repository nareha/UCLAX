import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import RidesharersPage from './components/RidesharersPage/RidesharersPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import SubmissionPage from './components/SubmissionPage/SubmissionPage';
import NotFoundPage from './components/404Page/404Page';

const App: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const handleIsVerified = useCallback(() => {
    setIsVerified(true);
  }, []);
  
  return (
    <>
      <GoogleOAuthProvider clientId="855516960445-ue7h075jd8jcp9jukvtbgd235sr29q27.apps.googleusercontent.com">
        <Navbar isVerified={isVerified} />
        <Routes>
  	      <Route path="/" element={<LandingPage isVerified={isVerified} verify={handleIsVerified} />} />
          <Route path="/ridesharers" element={isVerified ? <RidesharersPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={isVerified ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/submit" element={isVerified ? <SubmissionPage /> : <Navigate to="/" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
