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
import { useEffect, useState } from 'react';
import {
  useGetInvoiceQuery,
  useGetVendorQuery,
  useLazyUploadPaymentSlipQuery,
} from '../../_api/query';
import PaymentMethod from '../_components/payment/payment-method';
import { usePrivilege } from '../_context/privilege-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  IPaymentSlipUploadSchema,
  paymentSlipUploadSchema,
} from '@/shared/schema/paymentSlipUploadSchema';
import { invoiceArraySchema } from '@/shared/schema/invoiceSchema';
import { useRouter } from 'next/navigation';
import { paymentReceiptItemSchema } from '@/shared/schema/paymentReceiptItemSchema';
import { NotificationService } from '../../../_components/notification';
import FileUploader from '../../../_components/uploader';
import InvoiceTemplate from '../../../_components/dynamicPrintComponent/invoice-sm';
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

function Page() {
  const router = useRouter();
  const { checkAccess } = usePrivilege();
  const { data: isrVendor, isLoading: isISRVendorLoading } = useGetVendorQuery(
    {},
  );
  const [invoiceSlipImageUrl, setInvoiceSlipImageUrl] = useState<string | null>(
    null,
  );
  const invoiceInfo = useGetInvoiceQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const [uploadFile, uploadFileInfo] = useLazyUploadPaymentSlipQuery();
  const {
    register,
    formState,
    setValue,
    watch,
    handleSubmit,
    setError,
    control,
  } = useForm<IPaymentSlipUploadSchema>({
    defaultValues: {
      invoiceIds: [],
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
    if (invoiceInfo.data && invoiceInfo?.data?.invoice) {
      setValue('invoiceIds', [invoiceInfo?.data?.invoice.id]);
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
    if (uploadFileInfo.isError) {
      if (
        (uploadFileInfo.error as any).data?.message ===
        ' Transaction NUmber must be unique'
      ) {
        setError(`transactionNumber`, {
          message: (uploadFileInfo.error as any).data?.message,
        });
        NotificationService.requestErrorNotification(
          (uploadFileInfo.error as any).data?.message,
        );
      } else
        NotificationService.requestErrorNotification(
          'Failed to save Payment receipt',
        );
    }
    return () => {};
  }, [
    invoiceInfo.data,
    uploadFileInfo.data,
    uploadFileInfo.error,
    uploadFileInfo.isError,
  ]);

  if (invoiceInfo.isLoading || isISRVendorLoading) {
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
  if (!invoiceInfo.data?.invoice || isrVendor?.initial.isPPDARegistered) {
    return router.push('doc');
  }

  return (
    <Flex className="flex-col w-full relative min-h-[70vh] justify-between">
      <Box className=" min-w-full">
        <Flex className="gap-2 w-full">
          <form
            className="flex flex-col border p-4  h-fit  w-1/2"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <Center>
              <PaymentMethod />
            </Center>

            <Stack className="mt-10">
              <input
                {...register('invoiceIds')}
                value={
                  invoiceArraySchema.safeParse(invoiceInfo.data?.invoice)
                    .success
                    ? invoiceInfo.data?.invoice.id
                    : ''
                }
                hidden={true}
              />
              <input
                {...register('serviceId')}
                value={
                  invoiceArraySchema.safeParse(invoiceInfo.data?.invoice)
                    .success
                    ? invoiceInfo.data?.invoice.serviceId
                    : ''
                }
                hidden={true}
              />
              <TextInput
                label="Transaction Number"
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
                    <>
                      <Button
                        onClick={() =>
                          router.push(
                            isrVendor?.basic.countryOfRegistration !== 'Malawi'
                              ? 'ppda'
                              : `preferential`,
                          )
                        }
                        variant="outline"
                      >
                        Back
                      </Button>
                      <Button type="submit">Submit</Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() =>
                          router.push(
                            isrVendor?.basic.countryOfRegistration !== 'Malawi'
                              ? 'ppda'
                              : `preferential`,
                          )
                        }
                        variant="outline"
                      >
                        Back
                      </Button>
                      <Button onClick={onPreviousFileExists}>Next</Button>
                    </>
                  )
                ) : (
                  <>
                    <Button
                      onClick={() =>
                        router.push(
                          isrVendor?.basic.countryOfRegistration !== 'Malawi'
                            ? 'ppda'
                            : `preferential`,
                        )
                      }
                      variant="outline"
                    >
                      Back
                    </Button>
                    <Button type="submit">Submit</Button>
                  </>
                )
              ) : (
                ''
              )}
            </Flex>
          </form>
          <Flex className="flex-col border w-1/2">
            {invoiceInfo.data?.invoice && (
              <InvoiceTemplate invoiceData={invoiceInfo.data?.invoice} />
            )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Page;
