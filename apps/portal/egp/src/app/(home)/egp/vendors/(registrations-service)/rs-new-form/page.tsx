'use client';

import {
  useLazyGetDraftApplicationByUserIdQuery,
  useLazyGetFormInitiationRequestQuery,
} from '@/store/api/vendor_registration/query';
import Form from './form';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { SearchParamsToObject } from '../../_shared/lib/url/helper';
import { useEffect } from 'react';

export default function RsNewFormPage() {
  const router = useRouter();
  const applicationId = SearchParamsToObject('applicationId');
  const companyName = SearchParamsToObject('companyName');
  const legalFormofEntity = SearchParamsToObject('legalFormOfEntity');
  const Country = SearchParamsToObject('countryOfRegistration');
  const tinNumber = SearchParamsToObject('tinNumber');
  console.log(!applicationId);
  if (applicationId || (companyName && legalFormofEntity && Country)) {
  } else {
    router.push('rs-new');
  }

  const [
    trigger,
    {
      data: applicationData,
      isLoading: isApplicationDataLoading,
      isSuccess: isApplicationDataSuccess,
      status: applicationDataStatus,
    },
  ] = useLazyGetDraftApplicationByUserIdQuery();

  const [
    formInitiationRequestTrigger,
    {
      data: getFormInitiationRequestData,
      isLoading: isGetFormInitiationRequestLoading,
      isSuccess: isGetFormInitiationRequestSuccess,
      status: getFormInitiationRequestStatus,
    },
  ] = useLazyGetFormInitiationRequestQuery();

  useEffect(() => {
    if (applicationId) {
      trigger({
        vendorId: applicationId,
      });
    }
    if (companyName && legalFormofEntity && Country) {
      formInitiationRequestTrigger({
        companyName,
        legalFormofEntity,
        Country,
        tinNumber,
      });
    }
    return () => {};
  }, []);

  return (
    <section>
      <LoadingOverlay
        visible={isApplicationDataLoading || isGetFormInitiationRequestLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {applicationDataStatus == 'fulfilled' && applicationData ? (
        <Form formData={applicationData} formInitiationData={null} />
      ) : (
        <></>
      )}
      {getFormInitiationRequestStatus == 'fulfilled' &&
      getFormInitiationRequestData ? (
        <Form
          formData={null}
          formInitiationData={getFormInitiationRequestData}
        />
      ) : (
        <></>
      )}
    </section>
  );
}
