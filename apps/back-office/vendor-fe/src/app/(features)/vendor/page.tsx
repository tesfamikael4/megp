'use client';
import { useState } from 'react';
import classes from './_shared/scss/vendor.module.scss';
import SidebarPage from './sidebar/sidebar';
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
