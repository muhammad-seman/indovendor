'use client';

import React from 'react';
import TopBar from './TopBar';
import SecondaryNav from './SecondaryNav';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  return (
    <>
      <TopBar className={className} />
      <SecondaryNav className={className} />
    </>
  );
};

export default Navbar;