'use client';
import { Flex, Button, Box, LoadingOverlay } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAddFormMutation,
  useGetVendorQuery,
  useLazyGetVendorOnDemandQuery,
  useLazyUploadSupportingDocQuery,
} from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { usePrivilege } from '../../_context/privilege-context';
import FileUploader from '@/app/(features)/vendor/_components/uploader';
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export default function SupportingDocuments() {
  const router = useRouter();
  const [request, requestInfo] = useLazyGetVendorOnDemandQuery();
  const docInfo = useGetVendorQuery({}, { refetchOnMountOrArgChange: true });
  const [save, saveValues] = useAddFormMutation();
  const { updateAccess, updateStatus } = usePrivilege();

  const [uploadFile, uploadFileInfo] = useLazyUploadSupportingDocQuery();

  const [businessRegistrationFile, setBusinessRegistrationFile] =
    useState<File | null>(null);
  const [mRATPINCertificateFile, setMRATPINCertificateFile] =
    useState<File | null>(null);
  const [generalReceiptFile, setGeneralReceiptFile] = useState<File | null>(
    null,
  );
  const [mRATaxClearanceFile, setMRATaxClearanceFile] = useState<File | null>(
    null,
  );
  const [previousPPDARegistrationFile, setPreviousPPDARegistrationFile] =
    useState<File | null>(null);

  // Define state variables for each imageUrl
  const [businessRegistrationImageUrl, setBusinessRegistrationImageUrl] =
    useState<string | null>(null);
  const [mRATPINCertificateImageUrl, setMRATPINCertificateImageUrl] = useState<
    string | null
  >(null);
  const [generalReceiptImageUrl, setGeneralReceiptImageUrl] = useState<
    string | null
  >(null);
  const [mRATaxClearanceImageUrl, setMRATaxClearanceImageUrl] = useState<
    string | null
  >(null);
  const [
    previousPPDARegistrationImageUrl,
    setPreviousPPDARegistrationImageUrl,
  ] = useState<string | null>(null);

  // Define separate handler functions for each FileUploader
  const handleBusinessRegistrationChange = (file: File) => {
    setBusinessRegistrationFile(file);
    // Your additional logic here
  };

  const handleMRATPINCertificateChange = (file: File) => {
    setMRATPINCertificateFile(file);
    // Your additional logic here
  };

  const handleGeneralReceiptChange = (file: File) => {
    setGeneralReceiptFile(file);
    // Your additional logic here
  };

  const handleMRATaxClearanceChange = (file: File) => {
    setMRATaxClearanceFile(file);
    // Your additional logic here
  };

  const handlePreviousPPDARegistrationChange = (file: File) => {
    setPreviousPPDARegistrationFile(file);
    // Your additional logic here
  };

  useEffect(() => {
    if (docInfo.data && docInfo.data?.supportingDocuments) {
      docInfo.data?.supportingDocuments
        .businessRegistration_IncorporationCertificate &&
        setBusinessRegistrationImageUrl(
          `${VENDOR_URL}/upload/get-file/SupportingDocument/${docInfo.data?.supportingDocuments.businessRegistration_IncorporationCertificate}`,
        );
      docInfo.data?.supportingDocuments.mRA_TPINCertificate &&
        setMRATPINCertificateImageUrl(
          `${VENDOR_URL}/upload/get-file/SupportingDocument/${docInfo.data?.supportingDocuments.mRA_TPINCertificate}`,
        );
      docInfo.data?.supportingDocuments.previousPPDARegistrationCertificate &&
        setPreviousPPDARegistrationImageUrl(
          `${VENDOR_URL}/upload/get-file/SupportingDocument/${docInfo.data?.supportingDocuments.previousPPDARegistrationCertificate}`,
        );
      docInfo.data?.supportingDocuments.generalReceipt_BankDepositSlip &&
        setGeneralReceiptImageUrl(
          `${VENDOR_URL}/upload/get-file/SupportingDocument/${docInfo.data?.supportingDocuments.generalReceipt_BankDepositSlip}`,
        );
      docInfo.data?.supportingDocuments.mRATaxClearanceCertificate &&
        setMRATaxClearanceImageUrl(
          `${VENDOR_URL}/upload/get-file/SupportingDocument/${docInfo.data?.supportingDocuments.mRATaxClearanceCertificate}`,
        );
    }

    return () => {};
  }, [docInfo.data]);

  useEffect(() => {
    if (requestInfo.data?.initial) {
      updateAccess(requestInfo.data?.initial.level);
      updateStatus(requestInfo.data?.initial.status);
    }

    return () => {};
  }, [updateAccess, requestInfo.data?.initial.level]);

  console.log(requestInfo.data?.supportingDocuments);
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      //  router.push(`basic`);
    }

    return () => {};
  }, [requestInfo, router]);

  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Submitted Successfully!');
      router.push(`review`);
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
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

    return () => {};
  }, [requestInfo.data]);

  const onSave = async () => {
    try {
      if (businessRegistrationFile) {
        await uploadFile({
          file: businessRegistrationFile,
          fieldName: 'businessRegistration_IncorporationCertificate',
        });
      }

      if (mRATPINCertificateFile) {
        await uploadFile({
          file: mRATPINCertificateFile,
          fieldName: 'mRA_TPINCertificate',
        });
      }

      if (generalReceiptFile) {
        await uploadFile({
          file: generalReceiptFile,
          fieldName: 'generalReceipt_BankDepositSlip',
        });
      }

      if (mRATaxClearanceFile) {
        await uploadFile({
          file: mRATaxClearanceFile,
          fieldName: 'mRATaxClearanceCertificate',
        });
      }

      if (previousPPDARegistrationFile) {
        await uploadFile({
          file: previousPPDARegistrationFile,
          fieldName: 'previousPPDARegistrationCertificate',
        });
      }
      request({});

      // Now that all files are uploaded, you can proceed with saving the data

      NotificationService.successNotification('Files Uploaded Successfully!');
      router.push('review');
    } catch (error) {
      NotificationService.requestErrorNotification(
        'Error on file upload or save',
      );
    }
  };

  const FILE_SERVER_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';
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
  return (
    <Flex className="w-full flex-col gap-2">
      {requestInfo.data?.supportingDocuments !== null && (
        <>
          <FileUploader
            id="businessRegistration_IncorporationCertificate"
            label="Business Registration/Incorporation Certificate"
            placeholder="Choose File"
            onChange={handleBusinessRegistrationChange}
            getImageUrl={businessRegistrationImageUrl}
          />

          <FileUploader
            id="mRA_TPINCertificate"
            label="MRA TPIN Certificate"
            placeholder="Choose File"
            onChange={handleMRATPINCertificateChange}
            getImageUrl={mRATPINCertificateImageUrl}
          />

          {/* FileUploader for General Receipt/Bank Deposit Slip */}
          <FileUploader
            id="generalReceipt_BankDepositSlip"
            label="General Receipt/Bank Deposit Slip"
            placeholder="Choose File"
            onChange={handleGeneralReceiptChange}
            getImageUrl={generalReceiptImageUrl}
          />

          {/* FileUploader for MRA Tax Clearance Certificate */}
          <FileUploader
            id="mRATaxClearanceCertificate"
            label="MRA Tax Clearance Certificate"
            placeholder="Choose File"
            onChange={handleMRATaxClearanceChange}
            getImageUrl={mRATaxClearanceImageUrl}
          />

          {/* FileUploader for Previous PPDA Registration Certificate */}
          <FileUploader
            id="previousPPDARegistrationCertificate"
            label="Previous PPDA Registration Certificate"
            placeholder="Choose File"
            onChange={handlePreviousPPDARegistrationChange}
            getImageUrl={previousPPDARegistrationImageUrl}
          />
          <Flex justify="end" className="gap-2 mt-4">
            <Button
              onClick={() => router.push('preferential')}
              variant="outline"
            >
              Back
            </Button>
            <Button onClick={onSave}>Save</Button>
          </Flex>
        </>
      )}
    </Flex>
  );
}
