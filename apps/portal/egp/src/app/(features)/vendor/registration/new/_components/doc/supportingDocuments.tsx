'use client';
import { Flex, Button, Box, LoadingOverlay } from '@mantine/core';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAddFormMutation, useGetVendorQuery } from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import UppyAttachmentDashboard from '@/app/(features)/vendor/_components/UppyAttachmentDashboard/UppyAttachmentDashboard';
import { usePrivilege } from '../../_context/privilege-context';

export default function SupportingDocuments() {
  const router = useRouter();
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [save, saveValues] = useAddFormMutation();
  const { checkAccess, updateAccess } = usePrivilege();

  useEffect(() => {
    if (requestInfo.data?.initial.level) {
      updateAccess(requestInfo.data?.initial.level);
    }

    return () => {};
  }, [updateAccess, requestInfo.data?.initial.level]);

  console.log(requestInfo.data?.supportingDocuments);
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      //  router.push(`basic`);
    }

    return () => {};
  }, [requestInfo, router]);

  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('File Uploaded Successfully!');
      router.push(`review`);
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isSuccess, saveValues.isError, router]);

  const onSave = () => {
    if (requestInfo.data) {
      save({
        data: {
          ...requestInfo.data,
          initial: {
            ...requestInfo.data.initial,
            level: 'review',
          },
        },
      });
    }
  };
  const FILE_SERVER_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';
  if (requestInfo.isLoading) {
    ('hello isLoading');

    return (
      <Box pos="relative" className="w-full h-full">
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Box>
    );
  }
  if (requestInfo.data?.supportingDocuments === null || requestInfo.isError) {
    ('hello error');
    return null;
  }
  return (
    <Flex className="w-full flex-col gap-2">
      {requestInfo.data?.supportingDocuments !== null && (
        <>
          <UppyAttachmentDashboard
            tusServerGetUrl={FILE_SERVER_URL + '/upload/'}
            tusServerPostUrl={FILE_SERVER_URL + '/upload/'}
            id="businessRegistration_IncorporationCertificate"
            label="Business Registration/Incorporation Certificate"
            placeholder="Upload"
            metaData={{
              entityName: 'vendor',
              fieldName: 'businessRegistration_IncorporationCertificate',
              instanceId: requestInfo.data?.id,
            }}
            storeId={
              requestInfo.data?.supportingDocuments
                .businessRegistration_IncorporationCertificate
            }
            disabled={!checkAccess('doc')}
          />
          <UppyAttachmentDashboard
            tusServerGetUrl={FILE_SERVER_URL + '/upload/'}
            tusServerPostUrl={FILE_SERVER_URL + '/upload/'}
            id="mRA_TPINCertificate"
            label="MRA TPIN Certificate"
            placeholder="Upload"
            metaData={{
              entityName: 'vendor',
              fieldName: 'mRA_TPINCertificate',
              instanceId: requestInfo.data?.id,
            }}
            storeId={requestInfo.data?.supportingDocuments.mRA_TPINCertificate}
            disabled={!checkAccess('doc')}
          />
          <UppyAttachmentDashboard
            tusServerGetUrl={FILE_SERVER_URL + '/upload/'}
            tusServerPostUrl={FILE_SERVER_URL + '/upload/'}
            id="generalReceipt_BankDepositSlip"
            label="General Receipt/Bank Deposit Slip"
            placeholder="Upload"
            metaData={{
              entityName: 'vendor',
              fieldName: 'generalReceipt_BankDepositSlip',
              instanceId: requestInfo.data?.id,
            }}
            storeId={
              requestInfo.data?.supportingDocuments
                .generalReceipt_BankDepositSlip
            }
            disabled={!checkAccess('doc')}
          />
          <UppyAttachmentDashboard
            tusServerGetUrl={FILE_SERVER_URL + '/upload/'}
            tusServerPostUrl={FILE_SERVER_URL + '/upload/'}
            id="mRATaxClearanceCertificate"
            label="MRA Tax Clearance Certificate"
            placeholder="Upload"
            metaData={{
              entityName: 'vendor',
              fieldName: 'mRATaxClearanceCertificate',
              instanceId: requestInfo.data?.id,
            }}
            storeId={
              requestInfo.data?.supportingDocuments.mRATaxClearanceCertificate
            }
            disabled={!checkAccess('doc')}
          />
          <UppyAttachmentDashboard
            tusServerGetUrl={FILE_SERVER_URL + '/upload/'}
            tusServerPostUrl={FILE_SERVER_URL + '/upload/'}
            id="previousPPDARegistrationCertificate"
            label="Previous PPDA Registration Certificate"
            placeholder="Upload"
            metaData={{
              entityName: 'vendor',
              fieldName: 'previousPPDARegistrationCertificate',
              instanceId: requestInfo.data?.id,
            }}
            storeId={
              requestInfo.data?.supportingDocuments
                .previousPPDARegistrationCertificate
            }
            disabled={!checkAccess('doc')}
          />
          <Flex justify="end" className="gap-2 mt-4">
            {checkAccess('doc') && <Button onClick={onSave}>Save</Button>}
          </Flex>
        </>
      )}
    </Flex>
  );
}
