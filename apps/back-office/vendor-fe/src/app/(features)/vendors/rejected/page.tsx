'use client';
import { useLazyGetRejectedVendorListQuery } from '@/store/api/vendor_request_handler/approved-rejected-api';
import ApplicationList from './_components/List';

const VendorsList = () => {
  const [getFilteredList, { data, isLoading }] =
    useLazyGetRejectedVendorListQuery();
  return (
    <ApplicationList
      listOfItems={data ?? { items: [], total: 0 }}
      isLoading={isLoading}
      title="rejected"
      getFilteredList={getFilteredList}
    >
      <div>Approved Vendors List</div>
    </ApplicationList>
  );
};

export default VendorsList;
