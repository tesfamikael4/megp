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
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IPaymentSlipUploadSchema } from '@/shared/schema/paymentSlipUploadSchema';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import PaymentMethod from '../../renewal/_components/payment/payment-method';
import {
  useGetMyInvoiceQuery,
  useUploadPaymentReceiptUpgradeMutation,
} from '@/store/api/vendor-upgrade/api';
import FileUploader from '../../../_components/file-uploader/upload';
import { z } from 'zod';

const UpgradePaymentSchema = z.object({
  transactionNumber: z
    .string()
    .min(3, { message: 'Transaction number is required' }),
  file: z.instanceof(File).refine((data) => data instanceof File, {
    message: 'Payment slip is required is required',
  }),
});

function Page() {
  const router = useRouter();
  const [invoiceSlipImageUrl, setInvoiceSlipImageUrl] = useState<string | null>(
    null,
  );

  const { data, isLoading } = useGetMyInvoiceQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [uploadFile, uploadFileInfo] = useUploadPaymentReceiptUpgradeMutation(
    {},
  );
  const { register, formState, setValue, watch, handleSubmit, reset } = useForm<
    z.infer<typeof UpgradePaymentSchema>
  >({
    defaultValues: {
      transactionNumber: '',
      file: undefined,
    },
    resolver: zodResolver(UpgradePaymentSchema),
  });

  const onSubmitHandler: SubmitHandler<IPaymentSlipUploadSchema> = (values) => {
    const paymentData = {
      file: values.file,
      transactionNumber: values.transactionNumber,
      invoiceIds: data?.items?.map((item) => item.id),
    };
    return uploadFile(paymentData);
  };

  const handleFileChange = (file: File) => {
    setValue('file', file);
  };

  useEffect(() => {
    if (uploadFileInfo.isSuccess) {
      NotificationService.successNotification('Payed Successfully!');
      router.push('/vendor/registration/track-applications');
    }
    return () => {};
  }, [data, uploadFileInfo.data]);

  useEffect(() => {
    if (data?.items.length === 0)
      NotificationService.requestErrorNotification('No invoice found');
  }, [data?.items]);

  if (isLoading) {
    return (
      <Box pos="relative" className="w-full min-h-screen">
        <LoadingOverlay
          visible={true}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Box>
    );
  }
  if (data?.total === 0) {
    return router.push('business-areas');
  }
  return (
    <Flex className="flex-col w-full relative min-h-[70vh] justify-between">
      <Box className=" w-full">
        <Flex className="gap-2 w-full">
          <form
            className="flex flex-col border p-4  h-fit w-1/2"
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
                error={formState.errors.transactionNumber?.message}
              />
              <FileUploader
                id="your-file-uploader"
                label="Attach Payment slip"
                placeholder="Choose File"
                error={formState.errors.file && 'Payment slip is required'}
                onChange={(file) => handleFileChange(file)}
                getImageUrl={invoiceSlipImageUrl}
                onRemove={() => reset({ file: undefined })}
              />
            </Stack>
            <Flex justify="end" className="gap-2 mt-4">
              <Button
                type="submit"
                disabled={!watch('file') || !watch('transactionNumber')}
                loading={uploadFileInfo.isLoading}
              >
                Submit
              </Button>
            </Flex>
          </form>
          <Flex className="min-w-1/2 flex-col border w-1/2">
            {data?.items && data?.items?.length > 0 && (
              <InvoiceTemplate invoiceData={data?.items} />
            )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Page;
