'use client';

import { Flex, Button, Box, LoadingOverlay } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAddFormMutation,
  useGetVendorQuery,
  useLazyGetVendorOnDemandQuery,
  useLazyUploadSupportingDocQuery,
  useUploadSupportingDocumentsMutation,
} from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { usePrivilege } from '../../_context/privilege-context';
import FileUploader from '@/app/(features)/my-workspace/_components/uploader';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PreferentialTreatment } from '@/models/vendorRegistration';

const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

const supportingDocumentsSchema = z.object({
  businessRegistration_IncorporationCertificate: z.instanceof(File).optional(),
  mRA_TPINCertificate: z.instanceof(File).optional(),
  generalReceipt_BankDepositSlip: z.instanceof(File).optional(),
  mRATaxClearanceCertificate: z.instanceof(File).optional(),
  previousPPDARegistrationCertificate: z.instanceof(File).optional(),
  MSMECertificate: z.instanceof(File).optional(),
  ibmCertificate: z.instanceof(File).optional(),
  marginalizedCertificate: z.instanceof(File).optional(),
});

export default function SupportingDocuments() {
  const router = useRouter();
  const [request, requestInfo] = useLazyGetVendorOnDemandQuery();
  const docInfo = useGetVendorQuery({}, { refetchOnMountOrArgChange: true });
  const [save, saveValues] = useAddFormMutation();
  const { updateAccess, updateStatus } = usePrivilege();
  const check = (key: string) =>
    docInfo.data?.preferential.some(
      (preflll: PreferentialTreatment) => preflll.category === key,
    ) && docInfo.data?.basic.countryOfRegistration === 'Malawi';
  const supportingDocumentsSchema = z.object({
    businessRegistration_IncorporationCertificate: z
      .instanceof(File)
      .optional(),
    mRA_TPINCertificate: z.instanceof(File).optional(),
    generalReceipt_BankDepositSlip: z.instanceof(File).optional(),
    mRATaxClearanceCertificate: z.instanceof(File).optional(),
    previousPPDARegistrationCertificate: z.instanceof(File).optional(),
    MSMECertificate: check('msme')
      ? z.instanceof(File).refine((data) => data instanceof File, {
          message: 'MSME Certificate is required',
        })
      : z.instanceof(File).optional(),
    ibmCertificate: check('ibm')
      ? z.instanceof(File).refine((data) => data instanceof File, {
          message: 'IBM Certificate is required',
        })
      : z.instanceof(File).optional(),
    marginalizedCertificate: check('marginalized')
      ? z.instanceof(File).refine((data) => data instanceof File, {
          message: 'Marginalized Certificate is required',
        })
      : z.instanceof(File).optional(),
  });
  const { control, formState, register, setValue, watch, handleSubmit } =
    useForm<z.infer<typeof supportingDocumentsSchema>>({
      resolver: zodResolver(supportingDocumentsSchema),
    });

  const [files, setFiles] = useState<
    {
      key:
        | 'businessRegistration_IncorporationCertificate'
        | 'mRA_TPINCertificate'
        | 'generalReceipt_BankDepositSlip'
        | 'mRATaxClearanceCertificate'
        | 'previousPPDARegistrationCertificate'
        | 'MSMECertificate'
        | 'ibmCertificate'
        | 'marginalizedCertificate';
      file: File | null;
      imageUrl: string | null;
    }[]
  >([
    {
      key: 'businessRegistration_IncorporationCertificate',
      file: null,
      imageUrl: null,
    },
    { key: 'mRA_TPINCertificate', file: null, imageUrl: null },
    { key: 'generalReceipt_BankDepositSlip', file: null, imageUrl: null },
    { key: 'mRATaxClearanceCertificate', file: null, imageUrl: null },
    { key: 'previousPPDARegistrationCertificate', file: null, imageUrl: null },
    { key: 'MSMECertificate', file: null, imageUrl: null },
    { key: 'ibmCertificate', file: null, imageUrl: null },
    { key: 'marginalizedCertificate', file: null, imageUrl: null },
  ]);

  const [uploadFile, uploadFileInfo] = useUploadSupportingDocumentsMutation();

  // Define handler function for file change
  const handleFileChange = (file, key) => {
    setFiles((prevFiles) =>
      prevFiles.map((item) => (item.key === key ? { ...item, file } : item)),
    );
    setValue(key, file);
  };

  useEffect(() => {
    if (docInfo.data && docInfo.data?.supportingDocuments) {
      setFiles((prevFiles) =>
        prevFiles.map((item) => {
          return {
            ...item,
            imageUrl: docInfo.data?.supportingDocuments[item.key]
              ? item.key === 'MSMECertificate' ||
                item.key === 'ibmCertificate' ||
                item.key === 'marginalizedCertificate'
                ? `${VENDOR_URL}/upload/get-file/preferential-documents/${docInfo.data?.supportingDocuments[item.key]}`
                : `${VENDOR_URL}/upload/get-file/SupportingDocument/${docInfo.data?.supportingDocuments[item.key]}`
              : null,
          };
        }),
      );
    }
  }, [docInfo.data]);

  useEffect(() => {
    if (requestInfo.data?.initial) {
      updateAccess(requestInfo.data?.initial.level);
      updateStatus(requestInfo.data?.initial.status);
    }
  }, [updateAccess, requestInfo.data?.initial.level]);

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
    }
  }, [requestInfo]);

  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Submitted Successfully!');
      router.push('review');
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
  }, [saveValues.isSuccess, saveValues.isError, router]);

  useEffect(() => {
    if (requestInfo.data) {
      save({
        data: {
          ...requestInfo.data,
          initial: {
            ...requestInfo.data.initial,
            level: 'review',
          },
        },
      });
    }
  }, [requestInfo.data]);

  const onSave = async () => {
    try {
      await uploadFile(watch());
      request({});
      router.push('review');
    } catch (error) {
      NotificationService.requestErrorNotification(
        'Error on file upload or save',
      );
    }
  };

  if (requestInfo.isLoading) {
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

  if (requestInfo.data?.supportingDocuments === null || requestInfo.isError) {
    return null;
  }

  console.log(formState.errors);

  return (
    <Flex className="w-full flex-col gap-2">
      <form onSubmit={handleSubmit(onSave)}>
        <Flex align={'center'} gap={16} wrap={'wrap'}>
          {files.map(({ key, file, imageUrl }) => {
            const isMalawi =
              docInfo.data?.basic.countryOfRegistration === 'Malawi';
            const isCertificate = [
              'MSMECertificate',
              'ibmCertificate',
              'marginalizedCertificate',
            ].includes(key);
            const hasPreferentialTreatment = docInfo.data?.preferential.find(
              (pref: PreferentialTreatment) =>
                key.toLocaleLowerCase().startsWith(pref.category),
            );

            if (!isMalawi && isCertificate) {
              return null;
            } else if (
              (isCertificate && hasPreferentialTreatment) ||
              !isCertificate
            )
              return (
                <FileUploader
                  key={key}
                  id={key}
                  label={getLabelByKey(key)}
                  placeholder="Choose File"
                  onChange={(file) => handleFileChange(file, key)}
                  getImageUrl={imageUrl}
                  error={formState.errors[key]?.message ?? ''}
                />
              );
          })}
        </Flex>
        <Flex justify="end" className="gap-2 mt-4">
          <Button
            onClick={() =>
              router.push(
                requestInfo.data?.initial?.isPPDARegistered
                  ? docInfo.data?.basic.countryOfRegistration === 'Malawi'
                    ? 'preferential'
                    : 'ppda'
                  : 'payment',
              )
            }
            variant="outline"
          >
            Back
          </Button>
          <Button type="submit">Save & Continue</Button>
        </Flex>
      </form>
    </Flex>
  );
}

// Helper function to get label by key
function getLabelByKey(key) {
  const labels = {
    businessRegistration_IncorporationCertificate:
      'Business Registration /Incorporation Certificate',
    mRA_TPINCertificate: 'MRA TPIN Certificate',
    generalReceipt_BankDepositSlip: 'General Receipt/Bank Deposit Slip',
    mRATaxClearanceCertificate: 'MRA Tax Clearance Certificate',
    previousPPDARegistrationCertificate:
      'Previous PPDA Registration Certificate',
    MSMECertificate: 'Copy of MSME Certificate',
    ibmCertificate: 'IBM Certificate',
    marginalizedCertificate: 'Marginalized Certificate',
  };
  return labels[key];
}
