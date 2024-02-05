'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetVendorQuery } from '../../_api/query';
import RegistrationForm from '../_components/detail/formShell';
import { usePrivilege } from '../_context/privilege-context';

export default function Page() {
  const router = useRouter();
  const { updateAccess, updateStatus } = usePrivilege();
  const searchParams = useSearchParams();

  const requestInfo = useGetVendorQuery(
    {
      flag: 'Adjustment',
    },
    { refetchOnMountOrArgChange: true },
  );

  if (requestInfo.data?.initial) {
    updateAccess(requestInfo.data?.initial.level);
    updateStatus(requestInfo.data?.initial.status);
  }

  useEffect(() => {
    if (requestInfo.error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }
    if (requestInfo.data?.initial) {
      if (
        requestInfo.data?.initial.status === 'Submit' ||
        requestInfo.data?.status! === 'Approved'
      ) {
        router.push(`/vendor/registration/track-applications`);
      } else
        router.push(
          (requestInfo.data?.initial.level).toLowerCase() + '?' + searchParams,
        );
    }
    return () => {
      router.refresh();
    };
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
            supportingDocuments: requestInfo.data.supportingDocuments ?? {
              businessRegistration_IncorporationCertificate: '',
              mRA_TPINCertificate: '',
              generalReceipt_BankDepositSlip: '',
              mRATaxClearanceCertificate: '',
              previousPPDARegistrationCertificate: '',
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
