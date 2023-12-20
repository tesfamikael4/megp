'use client';
import {
  Flex,
  Button,
  LoadingOverlay,
  Stack,
  TextInput,
  Center,
  Box,
  Accordion,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import InvoiceTemplate from '../../../_components/dynamicPrintComponent/invoice-sm';
import {
  useAddFormMutation,
  useGetInvoiceQuery,
  useGetVendorQuery,
} from '../../_api/query';
import { NotificationService } from '../../../_components/notification';
import { useRouter } from 'next/navigation';
import PaymentMethod from '../_components/payment/payment-method';
import { usePrivilege } from '../_context/privilege-context';
import FileUploader from '../../../_components/file-uploader/upload';
import { createGetUrl } from '../../../_components/file-uploader/hooks';
import classes from './accordion.module.scss';
import { InvoiceData } from '@/models/vendorInvoice';

function Page() {
  const { checkAccess, updateAccess, lockElements } = usePrivilege();
  const router = useRouter();
  const [transactionNum, setTransactionNum] = useState<string>('');
  const invoiceInfo = useGetInvoiceQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const requestInfo = useGetVendorQuery(
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
    if (invoiceInfo.data?.initial.level) {
      updateAccess(invoiceInfo.data?.initial.level);
    }

    return () => {};
  }, [updateAccess, invoiceInfo.data?.initial.level]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveValues.isSuccess]);

  const onSave = () => {
    if (invoiceInfo.data && requestInfo.data) {
      save({
        data: {
          ...requestInfo.data,
          initial: {
            ...requestInfo.data.initial,
            level: 'doc',
          },
          invoice: invoiceInfo.data?.invoice,
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
  const FILE_SERVER_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

  return (
    <Flex className="flex-col w-full relative min-h-[70vh] justify-between">
      <Box className=" max-w-[850px]">
        <Accordion variant="separated" classNames={classes}>
          {invoiceInfo.data?.invoice &&
            invoiceInfo.data?.invoice.length > 0 && (
              <>
                {invoiceInfo.data?.invoice.map((invoice, key) => (
                  <Accordion.Item
                    key={key}
                    className={classes.item}
                    value={invoice.id}
                  >
                    <Accordion.Control>{invoice.serviceName}</Accordion.Control>
                    <Accordion.Panel>
                      <Flex className="gap-2 w-full">
                        <Flex className="flex-col border p-4  h-fit max-w-[390px] w-full">
                          <Center>
                            <PaymentMethod />
                          </Center>

                          <Stack className="mt-10">
                            <TextInput
                              label="Transaction Number"
                              value={transactionNum}
                              onChange={(e) =>
                                setTransactionNum(e.target.value)
                              }
                              required
                              {...lockElements('payment')}
                            />
                            {invoiceInfo.data?.invoice &&
                              invoiceInfo.data?.invoice[0] && (
                                <FileUploader
                                  serverGetUrl={
                                    FILE_SERVER_URL +
                                    createGetUrl(
                                      invoiceInfo.data?.paymentReceipt
                                        .attachment,
                                    )
                                  }
                                  serverPostUrl={
                                    FILE_SERVER_URL +
                                    '/upload/upload-file-to-minio/TransactionId/e29650a8-889a-4009-9a43-a2e8e5da8cb2/5aece916-282d-431a-b496-607602f6ccfc'
                                  }
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
                                  storeId={
                                    invoiceInfo.data?.invoice[0].attachment ??
                                    ''
                                  }
                                />
                                // <UppyAttachmentDashboard
                                //   tusServerGetUrl={FILE_SERVER_URL + '/upload/'}
                                //   tusServerPostUrl={FILE_SERVER_URL + '/upload/'}
                                //   id="paymentSlip"
                                //   label="Payment Slip"
                                //   placeholder="Upload"
                                //   metaData={{
                                //     entityName: 'paymentReceipt',
                                //     fieldName: 'paymentSlip',
                                //     instanceId: invoiceInfo.data?.id,
                                //     transactionId: transactionNum,
                                //     category: 'goods',
                                //     invoiceId: invoiceInfo.data?.invoice[0].id,
                                //     attachment: '',
                                //   }}
                                //   storeId={invoiceInfo.data?.invoice[0].attachment ?? ''}
                                // />
                              )}
                          </Stack>
                          <Flex justify="end" className="gap-2 mt-4">
                            <Button>Pay</Button>
                          </Flex>
                        </Flex>
                        <Flex
                          key={key}
                          className="min-w-[450px] flex-col border shadow-md w-full"
                        >
                          <InvoiceTemplate invoiceData={invoice} />
                        </Flex>
                      </Flex>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </>
            )}
        </Accordion>
      </Box>
      <Flex justify="end" className="gap-2 mt-4">
        {checkAccess('payment') && (
          <Button onClick={() => onSave()}>Continue</Button>
        )}
      </Flex>
    </Flex>
  );
}

export default Page;
