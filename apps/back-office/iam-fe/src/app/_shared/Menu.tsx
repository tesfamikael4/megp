'use client';
import React from 'react';
import Pannel from './pannel';

const Menu = () => {
  return (
    <Pannel
      title="Menu"
      showCollapseButton={false}
      className="h-[calc(100vh-16px)] overflow-auto"
    >
      List of Menu
    </Pannel>
  );
};

export default Menu;
