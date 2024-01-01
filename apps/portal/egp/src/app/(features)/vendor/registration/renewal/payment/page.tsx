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
  useGetRenewalInvoiceQuery,
  useLazyPostRenewalVendorQuery,
  useLazyUploadPaymentSlipQuery,
} from '../../_api/query';
import PaymentMethod from '../_components/payment/payment-method';
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
  const [invoiceSlipImageUrl, setInvoiceSlipImageUrl] = useState<string | null>(
    null,
  );

  const invoiceInfo = useGetRenewalInvoiceQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [submitRequest, submitRequestInfo] = useLazyPostRenewalVendorQuery();

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
    // uploadFile(values);
    if (
      invoiceInfo.data?.businessAreas &&
      Array.isArray(invoiceInfo.data?.businessAreas) &&
      invoiceInfo.data?.businessAreas.length > 0
    ) {
      submitRequest(invoiceInfo.data?.businessAreas.map((i) => i.id));
    }
  };

  const handleFileChange = (file: File) => {
    setValue('file', file);
  };

  useEffect(() => {
    if (
      invoiceInfo.data &&
      Array.isArray(invoiceInfo.data?.items) &&
      invoiceInfo.data?.items.length > 0
    ) {
      setValue(
        'invoiceId',
        invoiceInfo.data?.items.map((i) => i.id).join(',') ?? '',
      );
      if (invoiceInfo.data && invoiceInfo.data?.items[0]) {
        setValue('transactionNumber', invoiceInfo.data?.items[0].id ?? '');
      }
    }

    return () => {};
  }, [invoiceInfo.data]);

  useEffect(() => {
    if (
      invoiceInfo.data &&
      invoiceInfo.data?.items &&
      invoiceInfo.data?.items.length > 0
    ) {
      invoiceInfo.data.items[0]?.attachment &&
        setInvoiceSlipImageUrl(
          `${VENDOR_URL}/upload/get-file/paymentReceipt/${invoiceInfo.data.items[0]?.attachment}`,
        );
    }

    return () => {};
  }, [invoiceInfo.data]);

  useEffect(() => {
    if (submitRequestInfo.data) {
      NotificationService.successNotification('Payed Successfully!');
      router.push('/vendor/registration/track-applications');
    }
    return () => {};
  }, [submitRequestInfo.data]);

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
                  invoiceArraySchema.safeParse(invoiceInfo.data?.items).success
                    ? invoiceInfo.data?.items[0].id
                    : ''
                }
                hidden={true}
              />
              <input
                {...register('serviceId')}
                value={
                  invoiceArraySchema.safeParse(invoiceInfo.data?.items).success
                    ? invoiceInfo.data?.items[0].serviceId
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
              <Button type="submit">Pay</Button>
            </Flex>
          </form>
          <Flex className="min-w-[450px] flex-col border w-full">
            {invoiceInfo.data?.items && invoiceInfo.data?.items?.length > 0 && (
              <InvoiceTemplate invoiceData={invoiceInfo.data?.items} />
            )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Page;
