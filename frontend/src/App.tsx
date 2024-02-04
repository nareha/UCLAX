import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import NotFoundPage from './components/404Page/404Page';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
  	    <Route path="/" element={<LandingPage />} />
  	    <Route path="/profile" element={<ProfilePage />} />
  	    <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
