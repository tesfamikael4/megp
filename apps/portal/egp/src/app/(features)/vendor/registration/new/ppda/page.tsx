'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetVendorQuery } from '../../_api/query';
import { AreasOfBusinessInterestForm } from '../_components/ppda/formShell';
import { usePrivilege } from '../_context/privilege-context';

function Page() {
  const { updateAccess, updateStatus } = usePrivilege();

  const router = useRouter();
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  if (requestInfo.data?.initial) {
    updateAccess(requestInfo.data?.initial.level);
    updateStatus(requestInfo.data?.initial.status);
  }
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }
    if (requestInfo.data?.initial.status === 'Submitted') {
      router.push(`/vendor/registration/track-applications`);
    }
    return () => {};
  }, [requestInfo, router]);

  return (
    <section className="w-full relative">
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && requestInfo.isSuccess ? (
        <AreasOfBusinessInterestForm
          vendorInfo={requestInfo.data.initial}
          initialValues={{
            ...requestInfo.data,
          }}
        />
      ) : (
        <></>
      )}
    </section>
  );
}

export default Page;
