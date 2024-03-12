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
  // const { data, isLoading, isError, error } = useGetVendorInfoQuery(
  //   {},
  //   { refetchOnMountOrArgChange: true },
  // );
  const {
    data: vendor,
    isLoading: vendorLoading,
    isError: isVendorError,
    error: vendorError,
  } = useGetVendorQuery({}, { refetchOnMountOrArgChange: true });
  const { data, isLoading, isError, error } = useGetVendorStatusQuery({});
  const router = useRouter();

  if (isLoading || vendorLoading) return <LoadingOverlay visible={isLoading} />;
  if (error) return router.push('/vendor/dashboard');
  if (!data) return router.push('/vendor/dashboard');
  if (data?.status === 'Initial') return <NewRegistrationLanding />;
  if (data?.status === 'Pending' || data?.status === 'Submitted')
    return <SubmittedApplication />;
  if (data.status === 'Approved') return <ServiceLists />;
  if (data.status === 'Draft')
    return router.push('/vendor/registration/new/detail');
  if (data.status === 'Adjustment')
    return router.push('/vendor/registration/track-applications');
};

export default ServiceLayout;
