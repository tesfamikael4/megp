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
import { paymentReceiptItemSchema } from '../../../../../../shared/schema/paymentReceiptItemSchema';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

function Page() {
  const router = useRouter();
  const { checkAccess } = usePrivilege();
  const [invoiceSlipImageUrl, setInvoiceSlipImageUrl] = useState<string | null>(
    null,
  );
  const [invoiceSlipImageFile, setInvoiceSlipImageFile] = useState<File | null>(
    null,
  );
  const invoiceInfo = useGetInvoiceQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [uploadFile, uploadFileInfo] = useLazyUploadPaymentSlipQuery();
  const { register, formState, setValue, watch, handleSubmit } =
    useForm<IPaymentSlipUploadSchema>({
      defaultValues: {
        invoiceId: '',
        serviceId: '',
        transactionNumber: '',
        file: undefined,
      },
      resolver: zodResolver(paymentSlipUploadSchema),
    });

  const onSubmitHandler: SubmitHandler<IPaymentSlipUploadSchema> = (values) => {
    uploadFile(values);
  };

  const handleFileChange = (file: File) => {
    setValue('file', file);
  };
  const onPreviousFileExists = () => {
    NotificationService.successNotification('Payed Successfully!');
    router.push('doc');
  };

  useEffect(() => {
    if (
      invoiceInfo.data &&
      invoiceInfo.data?.paymentReceipt &&
      invoiceInfo.data?.paymentReceipt.attachment
    ) {
      setInvoiceSlipImageUrl(
        `${VENDOR_URL}/upload/get-file/paymentReceipt/${invoiceInfo.data?.paymentReceipt.attachment}`,
      );
    }

    return () => {};
  }, [invoiceInfo.data]);

  useEffect(() => {
    if (
      invoiceInfo.data &&
      Array.isArray(invoiceInfo.data?.invoice) &&
      invoiceInfo.data?.invoice.length > 0
    ) {
      console.log(invoiceInfo.data?.invoice.map((i) => i.id).join(','));

      setValue(
        'invoiceId',
        invoiceInfo.data?.invoice.map((i) => i.id).join(',') ?? '',
      );
      setValue(
        'serviceId',
        invoiceInfo.data?.paymentReceipt?.attachment === ''
          ? 'null'
          : invoiceInfo.data?.paymentReceipt?.attachment,
      );

      if (invoiceInfo.data && invoiceInfo.data?.paymentReceipt?.transactionId) {
        setValue(
          'transactionNumber',
          invoiceInfo.data?.paymentReceipt.transactionId,
        );
      }
    }

    return () => {};
  }, [invoiceInfo.data]);

  useEffect(() => {
    if (paymentReceiptItemSchema.safeParse(uploadFileInfo.data).success) {
      NotificationService.successNotification('Payed Successfully!');
      router.push('doc');
    }
    return () => {};
  }, [invoiceInfo.data, uploadFileInfo.data]);

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
                label="Attach Payment slip"
                placeholder="Choose File"
                error={formState.errors.file && 'Payment slip is required'}
                onChange={handleFileChange}
                getImageUrl={invoiceSlipImageUrl}
              />
            </Stack>
            <Flex justify="end" className="gap-2 mt-4">
              {checkAccess('payment') ? (
                invoiceSlipImageUrl ? (
                  watch().file ? (
                    <Button type="submit">Pay</Button>
                  ) : (
                    <Button onClick={onPreviousFileExists}>Next</Button>
                  )
                ) : (
                  <Button type="submit">Pay</Button>
                )
              ) : (
                ''
              )}
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
