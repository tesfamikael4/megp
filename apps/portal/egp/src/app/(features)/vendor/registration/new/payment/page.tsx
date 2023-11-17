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
import {
  useAddFormMutation,
  useGetVendorQuery,
  useLazyGetInvoiceQuery,
} from '../../_api/query';
import { NotificationService } from '../../../_components/notification';
import { useRouter } from 'next/navigation';
import PaymentMethod from '../_components/payment/payment-method';
import UppyAttachmentDashboard from '../../../_components/UppyAttachmentDashboard/UppyAttachmentDashboard';

function Page() {
  const router = useRouter();
  const [transactionNum, setTransactionNum] = useState<string>('');
  const requestInfo = useGetVendorQuery({});
  const [getInvoice, invoiceInfo] = useLazyGetInvoiceQuery();
  const [save, saveValues] = useAddFormMutation();

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
    }
    if (requestInfo.data) {
      getInvoice({});
    }
    return () => {};
  }, [requestInfo, getInvoice]);

  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Payed Successfully!');
      // router.push(doc);
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isSuccess, saveValues.isError, router]);

  useEffect(() => {
    if (invoiceInfo.isError) {
      NotificationService.requestErrorNotification('Error on getting invoice');
    }
    return () => {};
  }, [invoiceInfo.isSuccess, invoiceInfo.isError]);

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
          visible={
            saveValues.isLoading ||
            requestInfo.isLoading ||
            invoiceInfo.isLoading
          }
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
            {invoiceInfo.data?.invoice && invoiceInfo.data?.invoice[0] && (
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
                  invoiceId: invoiceInfo.data?.invoice[0].id,
                  attachment: '',
                }}
                storeId={invoiceInfo.data?.paymentReceipt[0].attachment}
              />
            )}
          </Stack>
          <Flex justify="end" className="gap-2 mt-4">
            <Button onClick={() => onSave()}>Pay</Button>
          </Flex>
        </Flex>
        {invoiceInfo.data?.invoice && invoiceInfo.data?.invoice[0] && (
          <Flex className="max-w-2xl flex-col border shadow-md w-full">
            <InvoiceTemplate invoiceData={invoiceInfo.data?.invoice[0]} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default Page;
