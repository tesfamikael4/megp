'use client';
import {
  Flex,
  Button,
  LoadingOverlay,
  Stack,
  TextInput,
  Center,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import InvoiceTemplate from '../../../_components/dynamicPrintComponent/invoice-sm';
import { getCookie } from 'cookies-next';
import { useAddFormMutation, useGetVendorQuery } from '../../_api/query';
import { NotificationService } from '../../../_components/notification';
import { useRouter } from 'next/navigation';
import PaymentMethod from '../_components/payment/payment-method';
import UppyAttachmentDashboard from '../../../_components/UppyAttachmentDashboard/UppyAttachmentDashboard';

function Page() {
  const router = useRouter();
  const [transactionNum, setTransactionNum] = useState<string>('');
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
      NotificationService.successNotification('Payed Successfully!');
      router.push(`doc`);
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isSuccess, saveValues.isError, router]);

  const onSave = () => {
    if (requestInfo.data && transactionNum) {
      save({
        data: {
          ...requestInfo.data,
          initial: {
            ...requestInfo.data.initial,
            level: 'doc',
          },
        },
      });
    }
  };
  return (
    <Flex className="flex-col w-full relative items-center justify-center">
      <Flex className="gap-2 w-full">
        <LoadingOverlay
          visible={saveValues.isLoading || requestInfo.isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Flex className="flex-col border p-4 shadow-md h-fit max-w-3xl w-full">
          <Center>
            <PaymentMethod />
          </Center>

          <Stack className="mt-10">
            <TextInput
              label="Transaction Number"
              value={transactionNum}
              onChange={(e) => setTransactionNum(e.target.value)}
              required
            />

            <UppyAttachmentDashboard
              tusServerGetUrl="http://localhost:3000/api/upload/"
              tusServerPostUrl="http://localhost:3000/api/upload/files/"
              id="paymentSlip"
              label="Payment Slip"
              placeholder="Upload"
              metaData={{
                entityName: 'paymentReceipt',
                fieldName: 'paymentSlip',
                instanceId: requestInfo.data?.id,
                transactionId: transactionNum,
                category: 'goods',
                invoiceId: requestInfo.data?.invoice[0].id,
                attachment: '',
              }}
              storeId={
                requestInfo.data?.supportingDocuments
                  .businessRegistration_IncorporationCertificate
              }
            />
          </Stack>
          <Flex justify="end" className="gap-2 mt-4">
            <Button onClick={() => onSave()}>Pay</Button>
          </Flex>
        </Flex>
        {requestInfo.data?.invoice[0] && (
          <Flex className="max-w-2xl flex-col border shadow-md w-full">
            <InvoiceTemplate invoiceData={requestInfo.data?.invoice[0]} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default Page;
