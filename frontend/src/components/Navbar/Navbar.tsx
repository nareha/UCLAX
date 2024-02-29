import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

interface Props {
  isVerified: boolean;
}

const Navbar: React.FC<Props> = ({isVerified}: Props) => {
  return (
    <nav>
      <NavLink to="/"><p>Home</p></NavLink>
      {isVerified &&
        <>
          <NavLink to="/ridesharers"><p>Ridesharers</p></NavLink>
          <NavLink to="/profile"><p>Profile</p></NavLink>
          <NavLink to="/submit"><p>Submit Ride</p></NavLink>
        </>
      }
    </nav>
  );
}

export default Navbar;
