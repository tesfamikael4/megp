'use client';
import classes from './_shared/scss/vendor.module.scss';
import { useRouter } from 'next/router';
import SidebarPage from './sidebar/sidebar';
import MainContentPage from './body/mainContent';
import TablePage from './_shared/_elements/table';
import React, { useState } from 'react';
import MainContentHeaderPage from './body/MainContentHeader';
import { Section } from '@megp/core-fe';
export default function ClientPage() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  return (
    <div className={classes.container}>
      <SidebarPage />
    </div>
  );
}
