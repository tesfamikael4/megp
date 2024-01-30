'use client';
import React, { useEffect } from 'react';
import { Flex, LoadingOverlay, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../_components/notification';
import RegistrationForm from './_components/detail/formShell';
import { IconFile, IconUserCircle } from '@tabler/icons-react';
import CardLayout from './_components/card-layout/card-layout';
import { useGetApproveVendorInfoQuery } from './_api/query';

export default function Page() {
  const router = useRouter();

  const requestInfo = useGetApproveVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (requestInfo.error) {
      // NotificationService.requestErrorNotification('Error on fetching data');
    }

    return () => {
      // router.refresh();
    };
  }, [requestInfo.data, requestInfo.error]);

  return (
    <section className="w-full relative flex flex-col p-6">
      <CardLayout
        withBorder
        className="w-2/3"
        header={
          <Flex className="w-full items-center justify-center">
            <IconUserCircle size={28} stroke={1.6} />
            <Text fw={700} fz="xl">
              Vendor Profile
            </Text>
          </Flex>
        }
      >
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
              supportingDocuments: requestInfo.data.supportingDocuments
                ? requestInfo.data.supportingDocuments
                : {
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
          <Flex className="w-full h-full items-center justify-center flex-col">
            <IconFile size={30} />
            No Data Found
          </Flex>
        )}
      </CardLayout>
    </section>
  );
}
