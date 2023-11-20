'use client';
import { Flex, Button } from '@mantine/core';
import React, { useEffect } from 'react';
import UppyAttachmentDashboard from '../../../_components/UppyAttachmentDashboard/UppyAttachmentDashboard';
import { useRouter } from 'next/navigation';
import { useAddFormMutation, useGetVendorQuery } from '../../_api/query';
import { NotificationService } from '../../../_components/notification';

function Page() {
  const router = useRouter();
  const requestInfo = useGetVendorQuery({});
  const [save, saveValues] = useAddFormMutation();
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
  const FILE_SERVER_URL =
    process.env.NEXT_PUBLIC_VENDOR_API + '/upload/' ?? '/venders/api/upload';

  return (
    <Flex className="w-full flex-col gap-2">
      <UppyAttachmentDashboard
        tusServerGetUrl={FILE_SERVER_URL}
        tusServerPostUrl={FILE_SERVER_URL}
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
      />
      <UppyAttachmentDashboard
        tusServerGetUrl={FILE_SERVER_URL}
        tusServerPostUrl={FILE_SERVER_URL}
        id="mRA_TPINCertificate"
        label="MRA TPIN Certificate"
        placeholder="Upload"
        metaData={{
          entityName: 'vendor',
          fieldName: 'mRA_TPINCertificate',
          instanceId: requestInfo.data?.id,
        }}
        storeId={requestInfo.data?.supportingDocuments.mRA_TPINCertificate}
      />
      <UppyAttachmentDashboard
        tusServerGetUrl={FILE_SERVER_URL}
        tusServerPostUrl={FILE_SERVER_URL}
        id="generalReceipt_BankDepositSlip"
        label="General Receipt/Bank Deposit Slip"
        placeholder="Upload"
        metaData={{
          entityName: 'vendor',
          fieldName: 'generalReceipt_BankDepositSlip',
          instanceId: requestInfo.data?.id,
        }}
        storeId={
          requestInfo.data?.supportingDocuments.generalReceipt_BankDepositSlip
        }
      />
      <UppyAttachmentDashboard
        tusServerGetUrl={FILE_SERVER_URL}
        tusServerPostUrl={FILE_SERVER_URL}
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
      />
      <UppyAttachmentDashboard
        tusServerGetUrl={FILE_SERVER_URL}
        tusServerPostUrl={FILE_SERVER_URL}
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
      />
      <Flex justify="end" className="gap-2 mt-4">
        <Button onClick={onSave}>Save</Button>
      </Flex>
    </Flex>
  );
}

export default Page;
