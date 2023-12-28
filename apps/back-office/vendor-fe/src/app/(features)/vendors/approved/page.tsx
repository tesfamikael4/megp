'use client';
import { useLazyGetVendorsQuery } from '@/store/api/vendor_request_handler/approved-rejected-api';
import React from 'react';
import ApplicationList from '../(common)/List';

const VendorsList = () => {
  const [getFilteredList, { data, isLoading }] = useLazyGetVendorsQuery();
  return (
    <ApplicationList
      listOfItems={data ?? { items: [], total: 0 }}
      isLoading={isLoading}
      title="approved"
      getFilteredList={getFilteredList}
    >
      <div>Approved Vendors List</div>
    </ApplicationList>
  );
};

export default VendorsList;
