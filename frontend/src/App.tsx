import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import RidesharersPage from './components/RidesharersPage/RidesharersPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import SubmissionPage from './components/SubmissionPage/SubmissionPage';
import NotFoundPage from './components/404Page/404Page';

import { GoogleOAuthProvider } from '@react-oauth/google';

const App: React.FC = () => {
  return (
    <>
    <GoogleOAuthProvider clientId="855516960445-ue7h075jd8jcp9jukvtbgd235sr29q27.apps.googleusercontent.com">
      <Navbar />
      <Routes>
  	    <Route path="/" element={<LandingPage />} />
        <Route path="/ridesharers" element={<RidesharersPage />} />
  	    <Route path="/profile" element={<ProfilePage />} />
        <Route path="/submit" element={<SubmissionPage />} />
  	    <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
