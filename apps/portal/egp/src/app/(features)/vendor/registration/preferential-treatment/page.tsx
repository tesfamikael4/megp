'use client';

import React, { useEffect, useState } from 'react';
import NewPreferentialForm from './components/NewPreferentialForm';
import { useGetDraftApplicationQuery } from '@/store/api/preferential-treatment/preferential-treatment.api';
import { LoadingOverlay } from '@mantine/core';
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

const PreferentialTreatment = () => {
  const {
    data: draft,
    isSuccess: isDraftSuccess,
    isLoading: isDraftLoading,
  } = useGetDraftApplicationQuery({});
  const [certificateUrl, setCertificateUrl] = useState<string>('');

  useEffect(() => {
    if (isDraftSuccess && draft && draft.length > 0) {
      setCertificateUrl(
        `${VENDOR_URL}/upload/get-file/SupportingDocument/${draft?.[0]?.certificateUrl}`,
      );
    }
  }, [draft, isDraftSuccess]);

  if (isDraftLoading) {
    return <LoadingOverlay visible />;
  }
  if (draft && draft.length > 0) {
    return (
      <NewPreferentialForm
        defaultValues={draft[0]}
        certificateUrl={certificateUrl}
      />
    );
  }
  return (
    <NewPreferentialForm
      defaultValues={{
        serviceId: '',
        certificate: undefined as any,
        certiNumber: '',
        additionalDocuments: [],
        remark: '',
      }}
    />
  );
};

export default PreferentialTreatment;
