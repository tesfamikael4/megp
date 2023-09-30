'use client';
import SupplierRegistrationPages from './bpm-handling/supplier-registration';
import styles from './supplierpage.module.scss';

export default function SupplierPages() {
  return (
    <div className={styles.wrapper}>
      <SupplierRegistrationPages />
      {/* <SupplierSidebarPage /> */}
    </div>
  );
}
