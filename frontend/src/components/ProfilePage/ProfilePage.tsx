import React from 'react';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  return (
    <div className="info-container">
      <b>User Information</b>
      <p>Name: Mickey Mouse</p>
      <p>Email: mickey@mouse.com</p>
    </div>
  );
}

export default ProfilePage;
