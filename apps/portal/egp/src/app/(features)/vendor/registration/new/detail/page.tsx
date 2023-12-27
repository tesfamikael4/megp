'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetVendorQuery } from '../../_api/query';
import RegistrationForm from '../_components/detail/formShell';
import { usePrivilege } from '../_context/privilege-context';

export default function Page() {
  const router = useRouter();
  const { updateAccess } = usePrivilege();

  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  if (requestInfo.data?.initial.level) {
    updateAccess(requestInfo.data?.initial.level);
  }
  useEffect(() => {
    if (requestInfo.error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }
    if (requestInfo.data?.initial.status === 'Submitted') {
      router.push(`/vendor/registration/track-applications`);
    }
    return () => {};
  }, [requestInfo.data, requestInfo.error]);

  return (
    <section className="w-full relative">
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && requestInfo.isSuccess ? (
        <RegistrationForm
          vendorInfo={requestInfo.data.initial}
          initialValues={{
            ...requestInfo.data,
            address:
              requestInfo.data.address == null
                ? {
                    postalAddress: '',
                    primaryEmail: '',
                    alternateEmail: '',
                    mobilePhone: '',
                    telephone: '',
                    fax: '',
                    website: '',
                  }
                : requestInfo.data.address,
            contactPersons:
              requestInfo.data.contactPersons == null
                ? []
                : requestInfo.data.contactPersons,
            businessSizeAndOwnership:
              requestInfo.data.businessSizeAndOwnership == null
                ? {
                    registeredCapital: {
                      amount: '',
                      currency: '',
                    },
                    paidUpCapital: {
                      amount: '',
                      currency: '',
                    },
                    numberOfEmployees: '',
                    ownershipType: '',
                  }
                : requestInfo.data.businessSizeAndOwnership,
            shareHolders:
              requestInfo.data.shareHolders == null
                ? []
                : requestInfo.data.shareHolders,
            beneficialOwnership:
              requestInfo.data.beneficialOwnership == null
                ? []
                : requestInfo.data.beneficialOwnership,
            bankAccountDetails:
              requestInfo.data.bankAccountDetails == null
                ? []
                : requestInfo.data.bankAccountDetails,
            areasOfBusinessInterest:
              requestInfo.data.areasOfBusinessInterest == null
                ? []
                : requestInfo.data.areasOfBusinessInterest,
            invoice:
              requestInfo.data.invoice == null ? [] : requestInfo.data.invoice,
            supportingDocuments: {
              businessRegistration_IncorporationCertificate: '',
              mRA_TPINCertificate: '',
              generalReceipt_BankDepositSlip: '',
              mRATaxClearanceCertificate: '',
              previousPPDARegistrationCertificate: '',
              mSMECertificate: '',
            },
            paymentReceipt: requestInfo.data.paymentReceipt,
          }}
        />
      ) : (
        <></>
      )}
    </section>
  );
}
