'use client';
import classes from './_shared/scss/vendor.module.scss';
import SidebarPage from './sidebar/sidebar';
export default function ClientPage() {
  return (
    <div className={classes.container}>
      <SidebarPage />
    </div>
  );
}
