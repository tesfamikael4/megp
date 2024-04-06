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
import InvoiceTemplate from '../../../../_components/dynamicPrintComponent/invoice-sm';
import { useGetRenewalInvoiceQuery } from '../../_api/query';
import PaymentMethod from '../_components/payment/payment-method';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { paymentSlipUploadSchema } from '@/shared/schema/paymentSlipUploadSchema';
import { useRouter } from 'next/navigation';
import { useUploadPaymentReceiptRenewalMutation } from '@/store/api/vendor-upgrade/api';
import FileUploader from '../../../../_components/uploader';
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

function Page() {
  const router = useRouter();
  const [invoiceSlipImageUrl, setInvoiceSlipImageUrl] = useState<string | null>(
    null,
  );

  const { data, isLoading, isSuccess } = useGetRenewalInvoiceQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const [uploadFile, { isLoading: isUploading, isSuccess: isUploadSuccess }] =
    useUploadPaymentReceiptRenewalMutation({});

  const { register, formState, setValue, watch, handleSubmit } = useForm<any>({
    defaultValues: {
      invoiceIds: '',
      transactionNumber: '',
      file: undefined,
    },
    resolver: zodResolver(paymentSlipUploadSchema),
  });

  console.log(formState.errors);

  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    if (data) {
      const paymentData = {
        file: values.file,
        transactionNumber: values.transactionNumber,
        invoiceIds: [data.id],
      };
      // submitRequest(data?.items.map((i) => i.id));
      uploadFile(paymentData)
        .unwrap()
        .then(() => {
          router.push('/vendor/registration/track-applications');
        });
    }
  };

  const handleFileChange = (file: File) => {
    setValue('file', file);
  };

  useEffect(() => {
    if (data) {
      setValue('invoiceIds', [data.id]);
    }
    return () => {};
  }, [data]);

  useEffect(() => {
    if (data && data.attachment) {
      setInvoiceSlipImageUrl(
        `${VENDOR_URL}/upload/get-file/paymentReceipt/${data?.attachment}`,
      );
    }

    return () => {};
  }, [data]);

  if (isLoading) {
    return (
      <Box pos="relative" className="w-full h-full">
        <LoadingOverlay
          visible={true}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Box>
    );
  } else if (!data) {
    router.push('ppda');
  } else
    return (
      <Flex className="flex-col w-full relative min-h-[70vh] justify-between">
        <Box className=" max-w-full">
          <Flex className="gap-2 w-full">
            <form
              className="flex flex-col border p-4  h-fit max-w-1/2 w-1/2"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <Center>
                <PaymentMethod />
              </Center>

              <Stack className="mt-10">
                <TextInput
                  label="Transaction Number"
                  required
                  {...register('transactionNumber')}
                  error={
                    formState.errors.transactionNumber && (
                      <p>formState.errors.transactionNumber?.message</p>
                    )
                  }
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
                <Button type="submit" loading={isUploading}>
                  Submit
                </Button>
              </Flex>
            </form>
            <Flex className="min-w-1/2 flex-col border w-1/2">
              {data && <InvoiceTemplate invoiceData={data} />}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    );
}

export default Page;
