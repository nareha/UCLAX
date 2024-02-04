import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <NavLink to="/"><p>Home</p></NavLink>
      <NavLink to="/profile"><p>Profile</p></NavLink>
    </nav>
  );
}

export default Navbar;
