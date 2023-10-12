'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useGetFormQuery } from '@/store/api/vendor_registration/query';
import RegistrationForm from './_components/formShell';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { FormData } from '@/models/vendorRegistration';
import { setCookie, hasCookie, getCookie } from 'cookies-next';

const initialValue: FormData = {
  basic: {
    name: '',
    businessType: '',
    origin: '',
    district: '',
    country: '',
    tinNumber: '',
  },
  businessSizeAndOwnership: {
    registeredCapital: { amount: '', currency: '' },
    paidUpCapital: { amount: '', currency: '' },
    numberOfEmployees: '',
    ownershipType: '',
  },
  address: {
    postalAddress: '',
    primaryEmail: '',
    alternateEmail: '',
    mobilePhone: '',
    telephone: '',
    fax: '',
    website: '',
  },
  contactPersons: [],
  shareHolders: [],
  beneficialOwnership: [],
  bankAccountDetails: [],
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: null,
    mRA_TPINCertificate: null,
    generalReceipt_BankDepositSlip: null,
    mRATaxClearanceCertificate: null,
    previousPPDARegistrationCertificate: null,
    mSMECertificate: null,
  },
};
export default function Page({ params }: { params: { vendorId: string } }) {
  const router = useRouter();
  const requestInfo = useGetFormQuery({
    vendorId: params.vendorId,
  });
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification(
        'Error on fetching form data',
      );
      router.push(`/egp/vendors/new`);
    }
    if (requestInfo.data?.status === 'Submitted') {
      router.push(`/egp/vendors/track-applications`);
    }
    return () => {};
  }, [requestInfo, router]);

  return (
    <section>
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && requestInfo.isSuccess ? (
        <RegistrationForm
          vendorId={params.vendorId}
          initialValues={{
            ...initialValue,
            ...requestInfo.data,
          }}
        />
      ) : (
        <></>
      )}
    </section>
  );
}
