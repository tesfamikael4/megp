'use client';
import { useLazyGetRejectedVendorListQuery } from '@/store/api/vendor_request_handler/approved-rejected-api';
import ApplicationList from '../(common)/List';

const VendorsList = () => {
  const [getFilteredList, { data, isLoading }] =
    useLazyGetRejectedVendorListQuery();
  return (
    <ApplicationList
      listOfItems={data ?? { items: [], total: 0 }}
      isLoading={isLoading}
      title="debarred"
      getFilteredList={getFilteredList}
    >
      <div>Debarred Vendors List</div>
    </ApplicationList>
  );
};

export default VendorsList;
