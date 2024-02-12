import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import NotFoundPage from './components/404Page/404Page';
import SubmissionPage from './components/SubmissionPage/SubmissionPage';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
  	    <Route path="/" element={<LandingPage />} />
  	    <Route path="/profile" element={<ProfilePage />} />
        <Route path="/submit" element = {<SubmissionPage />} />
  	    <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
