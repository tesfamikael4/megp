import { FileInput, Stack } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import React from 'react';
import { PassFormDataProps } from '../detail/formShell';

export const SupportingDocuments: React.FC<PassFormDataProps> = ({
  register,
}) => {
  return (
    <>
      <Stack my={15}>
        <FileInput
          label="Business Registration/Incorporation Certificate"
          id="businessRegistration_IncorporationCertificate"
          placeholder="Upload"
          leftSection={<IconUpload size={'1rem'} />}
          {...register(
            `supportingDocuments.businessRegistration_IncorporationCertificate`,
            'file',
          )}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="MRA TPIN Certificate"
          id="mRA_TPINCertificate"
          placeholder="Upload"
          leftSection={<IconUpload size={'1rem'} />}
          {...register(`supportingDocuments.mRA_TPINCertificate`, 'file')}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="General Receipt/Bank Deposit Slip"
          id="generalReceipt_BankDepositSlip"
          placeholder="Upload"
          leftSection={<IconUpload size={'1rem'} />}
          {...register(
            `supportingDocuments.generalReceipt_BankDepositSlip`,
            'file',
          )}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="MRA Tax Clearance Certificate"
          id="mRATaxClearanceCertificate"
          placeholder="Upload"
          leftSection={<IconUpload size={'1rem'} />}
          {...register(
            `supportingDocuments.mRATaxClearanceCertificate`,
            'file',
          )}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="Previous PPDA Registration Certificate"
          id="previousPPDARegistrationCertificate"
          placeholder="Upload"
          leftSection={<IconUpload size={'1rem'} />}
          {...register(
            `supportingDocuments.previousPPDARegistrationCertificate`,
            'file',
          )}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="MSME Certificate "
          id="mSMECertificate "
          placeholder="Upload"
          leftSection={<IconUpload size={'1rem'} />}
          {...register(`supportingDocuments.mSMECertificate`, 'file')}
        />
      </Stack>
    </>
  );
};
