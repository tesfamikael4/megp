'use client';

import { useGetApplicationStatusByUserIdQuery } from '@/store/api/vendor_registration/query';
import Form from './form';
import { generateAndSaveKey } from '../../_shared/lib/objectParser/object';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';
export default function RsNewPage() {
  const router = useRouter();

  const {
    data: applicationData,
    isLoading: isApplicationDataLoading,
    isSuccess: isApplicationDataSuccess,
    status: applicationDataStatus,
  } = useGetApplicationStatusByUserIdQuery({
    userId: generateAndSaveKey() as string,
  });
  React.useEffect(() => {
    if (applicationDataStatus == 'fulfilled' && applicationData) {
      applicationData?.status == 'Save as Draft' &&
        router.push('draft-applications');

      applicationData?.status == 'Submitted' &&
        router.push('track-applications');
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationData, applicationDataStatus]);

  return (
    <section>
      <LoadingOverlay
        visible={isApplicationDataLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Form />
    </section>
  );
}
