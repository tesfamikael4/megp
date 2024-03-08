'use client';
import { Box, Button, LoadingOverlay } from '@mantine/core';
import {
  useGetVendorInfoQuery,
  useGetVendorQuery,
  useGetVendorStatusQuery,
} from '../registration/_api/query';
import { useRouter } from 'next/navigation';
import { ServiceLists } from './_components/service-list';
import { SubmittedApplication } from './_components/submitted-application';
import NewRegistrationLanding from './_components/new-registration-landing';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const ServiceLayout = () => {
  const { data, isLoading, isError, error } = useGetVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const {
    data: vendor,
    isLoading: vendorLoading,
    isError: isVendorError,
    error: vendorError,
  } = useGetVendorQuery({}, { refetchOnMountOrArgChange: true });
  const router = useRouter();

  if (isLoading || vendorLoading) return <LoadingOverlay visible={isLoading} />;
  if (
    (isError && (error as FetchBaseQueryError).status !== 404) ||
    isVendorError
  )
    return router.push('/vendor/dashboard');
  if (!data) {
    if (!vendor) return <NewRegistrationLanding />;
    else {
      if (vendor.status === 'Approved') return <ServiceLists />;
      else if (vendor.status === 'Completed')
        return <ServiceLists isCompleted={true} />;
      else if (vendor.status === 'Draft')
        return router.push('/vendor/registration/new/detail');
      else if (vendor.status === 'Adjustment')
        return router.push('/vendor/registration/new/detail');
    }
  } else {
    if (
      data.Status === 'Adjustment' ||
      data.vendorStatus === 'Adjustment' ||
      (data.services?.length &&
        data.services.some((service) => service.status === 'Adjustment'))
    )
      return router.push('/vendor/registration/track-applications');
    else if (data.Status === 'Submitted') return <SubmittedApplication />;
  }
};

export default ServiceLayout;
