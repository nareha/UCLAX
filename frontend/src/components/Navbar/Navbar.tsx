/**
 *Navigation Bar that displays page links at the top of the App.
 *@module components/NavBar
 */
import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

/** User's verification status */
export interface Props {
  isVerified: boolean;
}

/** @ignore */
const Navbar: React.FC<Props> = ({isVerified}: Props) => {
  return (
    <nav>
      <NavLink to="/"><p>Home</p></NavLink>
      {isVerified &&
        <>
          <NavLink to="/ridesharers"><p>Ridesharers</p></NavLink>
          <NavLink to="/submit"><p>Submit Ride</p></NavLink>
        </>
      }
    </nav>
  );
}

export default Navbar;
