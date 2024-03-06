'use client';
import { Suspense, useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../../_components/notification';
import { useGetVendorQuery } from '../../_api/query';
import RegistrationForm from '../_components/detail/formShell';

export default function Page() {
  const router = useRouter();

  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  // if (requestInfo.data?.initial) {
  //   updateAccess(requestInfo.data?.initial.level);
  //   updateStatus(requestInfo.data?.initial.status);
  // }

  useEffect(() => {
    if (requestInfo.error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }

    return () => {};
  }, [requestInfo.data, requestInfo.error]);

  if (
    requestInfo?.data?.status === 'Approved' ||
    requestInfo?.data?.status === 'Completed'
  ) {
    return router.push('/vendor/service');
  }

  return (
    <Suspense>
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
                requestInfo.data.invoice == null
                  ? []
                  : requestInfo.data.invoice,
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
    </Suspense>
  );
}
