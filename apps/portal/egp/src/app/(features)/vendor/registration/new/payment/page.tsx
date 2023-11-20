'use client';
import {
  Flex,
  Button,
  LoadingOverlay,
  Stack,
  TextInput,
  Center,
  Box,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import InvoiceTemplate from '../../../_components/dynamicPrintComponent/invoice-sm';
import { useAddFormMutation, useGetInvoiceQuery } from '../../_api/query';
import { NotificationService } from '../../../_components/notification';
import { useRouter } from 'next/navigation';
import PaymentMethod from '../_components/payment/payment-method';
import UppyAttachmentDashboard from '../../../_components/UppyAttachmentDashboard/UppyAttachmentDashboard';

function Page() {
  const router = useRouter();
  const [transactionNum, setTransactionNum] = useState<string>('');
  const invoiceInfo = useGetInvoiceQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [save, saveValues] = useAddFormMutation();

  useEffect(() => {
    if (invoiceInfo.isError) {
      NotificationService.requestErrorNotification('Error on getting invoice');
    }
    return () => {};
  }, [invoiceInfo.isError]);

  useEffect(() => {
    if (invoiceInfo.data?.invoice && invoiceInfo.data?.invoice?.length <= 0) {
      NotificationService.requestErrorNotification('Error on getting invoice');
    }

    return () => {};
  }, [invoiceInfo.data]);

  useEffect(() => {
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isError]);

  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Payed Successfully!');
      router.push('doc');
    }
    return () => {};
  }, [saveValues.isSuccess]);

  const onSave = () => {
    if (invoiceInfo.data && transactionNum) {
      save({
        data: {
          ...invoiceInfo.data,
          initial: {
            ...invoiceInfo.data.initial,
            level: 'doc',
          },
        },
      });
    }
  };

  if (invoiceInfo.isLoading) {
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
  if (invoiceInfo.isError) {
    return null;
  }
  const FILE_SERVER_URL =
    process.env.NEXT_PUBLIC_VENDOR_API + '/upload/' ?? '/venders/api/upload';

  return (
    <Flex className="flex-col w-full relative items-center justify-center">
      <Flex className="gap-2 w-full">
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
                tusServerGetUrl={FILE_SERVER_URL}
                tusServerPostUrl={FILE_SERVER_URL}
                id="paymentSlip"
                label="Payment Slip"
                placeholder="Upload"
                metaData={{
                  entityName: 'paymentReceipt',
                  fieldName: 'paymentSlip',
                  instanceId: invoiceInfo.data?.id,
                  transactionId: transactionNum,
                  category: 'goods',
                  invoiceId: invoiceInfo.data?.invoice[0].id,
                  attachment: '',
                }}
                storeId={invoiceInfo.data?.invoice[0].attachment ?? ''}
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
