'use client';
import DatabaseIcon from '../vendor/_shared/icons/Database';
import { Tabs, Badge } from '@mantine/core';
import SupplierRegistrationPages from './bpm-handling/supplier-registration';
import styles from './supplierpage.module.scss';
import SupplierSidebarPage from './bpm-handling/suplier-page-sidebar';

import { useGetAllVendorRequestsQuery } from '@/store/api/vendor_request_handler/new_registration_query';
export default function SupplierPages() {
  const req = useGetAllVendorRequestsQuery({
    serviceKey: 'newRegistration',
  });
  console.log('pageeee');
  console.log(req);
  return (
    <div className={styles.wrapper}>
      <SupplierRegistrationPages />
      {/* <SupplierSidebarPage /> */}
    </div>
  );
}
