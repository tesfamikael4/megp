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
  useGetInvoiceQuery,
  useLazyGetPaymentSlipQuery,
  useLazyUploadPaymentSlipQuery,
} from '../../_api/query';
import PaymentMethod from '../_components/payment/payment-method';
import { usePrivilege } from '../_context/privilege-context';
import FileUploader from '../../../_components/file-uploader/upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  IPaymentSlipUploadSchema,
  paymentSlipUploadSchema,
} from '@/shared/schema/paymentSlipUploadSchema';
import {
  invoiceArraySchema,
  invoiceDataSchema,
} from '@/shared/schema/invoiceSchema';
import {
  paymentReceiptArraySchema,
  paymentReceiptItemSchema,
} from '../../../../../../shared/schema/paymentReceiptItemSchema';
import { isUrl } from '@/shared/schema/commonSchema';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';

function Page() {
  const router = useRouter();
  const { checkAccess, updateAccess, lockElements } = usePrivilege();
  const [invoiceSlipImageUrl, setInvoiceSlipImageUrl] = useState<string | null>(
    null,
  );
  const invoiceInfo = useGetInvoiceQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [uploadFile, uploadFileInfo] = useLazyUploadPaymentSlipQuery();
  const [getFile, getFileInfo] = useLazyGetPaymentSlipQuery();
  const { register, formState, setValue, watch, handleSubmit } =
    useForm<IPaymentSlipUploadSchema>({
      defaultValues: {
        invoiceId: '47e6c7a0-0365-4bc6-a7fa-0f54344d280e',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        transactionNumber: '1231231231',
        file: undefined,
      },
      resolver: zodResolver(paymentSlipUploadSchema),
    });
  console.log(watch(), formState.errors);

  const onSubmitHandler: SubmitHandler<IPaymentSlipUploadSchema> = (values) => {
    console.log('Selected file:', values.file);
    uploadFile(values);
  };

  const handleFileChange = (file: File) => {
    setValue('file', file);
  };
  useEffect(() => {
    if (
      invoiceArraySchema.safeParse(invoiceInfo.data?.invoice).success &&
      invoiceDataSchema.safeParse(invoiceInfo.data?.invoice[0]).success
    ) {
      setValue('invoiceId', invoiceInfo.data?.invoice[0].id ?? '');
      setValue('serviceId', invoiceInfo.data?.invoice[0].serviceId ?? '');
    }

    return () => {};
  }, [invoiceInfo.data]);

  useEffect(() => {
    if (paymentReceiptItemSchema.safeParse(uploadFileInfo.data).success) {
      NotificationService.successNotification('Payed Successfully!');
      router.push('doc');
    }
    if (
      paymentReceiptArraySchema.safeParse(invoiceInfo.data?.paymentReceipt)
        .success &&
      paymentReceiptItemSchema.safeParse(invoiceInfo.data?.paymentReceipt[0])
        .success
    ) {
      getFile({
        attachment: invoiceInfo.data?.paymentReceipt[0].attachment ?? '',
      });
    }

    return () => {};
  }, [invoiceInfo.data, uploadFileInfo.data]);

  useEffect(() => {
    if (getFileInfo.error) {
      const errorResponse = getFileInfo.error as any;
      isUrl(errorResponse.data) && setInvoiceSlipImageUrl(errorResponse.data);
    }

    return () => {};
  }, [getFileInfo.error]);

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

  return (
    <Flex className="flex-col w-full relative min-h-[70vh] justify-between">
      <Box className=" max-w-[850px]">
        <Flex className="gap-2 w-full">
          <form
            className="flex flex-col border p-4  h-fit max-w-[390px] w-full"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <Center>
              <PaymentMethod />
            </Center>

            <Stack className="mt-10">
              <input
                {...register('invoiceId')}
                value={
                  invoiceArraySchema.safeParse(invoiceInfo.data?.invoice)
                    .success
                    ? invoiceInfo.data?.invoice[0].id
                    : ''
                }
                hidden={true}
              />
              <input
                {...register('serviceId')}
                value={
                  invoiceArraySchema.safeParse(invoiceInfo.data?.invoice)
                    .success
                    ? invoiceInfo.data?.invoice[0].serviceId
                    : ''
                }
                hidden={true}
              />
              <TextInput
                label="Transaction Number"
                required
                {...register('transactionNumber')}
                error={formState.errors.transactionNumber?.message}
              />
              <FileUploader
                id="your-file-uploader"
                label="Upload File"
                placeholder="Choose File"
                error={formState.errors.file && 'Payment slip is required'}
                onChange={handleFileChange}
                getImageUrl={invoiceSlipImageUrl}
                onRemove={() => setInvoiceSlipImageUrl(null)}
              />
            </Stack>
            <Flex justify="end" className="gap-2 mt-4">
              {checkAccess('payment') && <Button type="submit">Pay</Button>}
            </Flex>
          </form>
          <Flex className="min-w-[450px] flex-col border w-full">
            {invoiceInfo.data?.invoice &&
              invoiceInfo.data?.invoice?.length > 0 && (
                <InvoiceTemplate invoiceData={invoiceInfo.data?.invoice} />
              )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Page;
