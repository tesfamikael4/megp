import { FileInput, Stack } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import React from 'react';

interface Props {
  form: any;
}

export const SupportingDocuments: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <FileInput
          label="Business Registration/Incorporation Certificate"
          id="businessRegistration_IncorporationCertificate"
          placeholder="Upload"
          icon={<IconUpload size={'1rem'} />}
          {...form.getInputProps(
            `supportingDocuments.businessRegistration_IncorporationCertificate`,
          )}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="MRA TPIN Certificate"
          id="mRA_TPINCertificate"
          placeholder="Upload"
          icon={<IconUpload size={'1rem'} />}
          {...form.getInputProps(`supportingDocuments.mRA_TPINCertificate`)}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="General Receipt/Bank Deposit Slip"
          id="generalReceipt_BankDepositSlip"
          placeholder="Upload"
          icon={<IconUpload size={'1rem'} />}
          {...form.getInputProps(
            `supportingDocuments.generalReceipt_BankDepositSlip`,
          )}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="MRA Tax Clearance Certificate"
          id="mRATaxClearanceCertificate"
          placeholder="Upload"
          icon={<IconUpload size={'1rem'} />}
          {...form.getInputProps(
            `supportingDocuments.mRATaxClearanceCertificate`,
          )}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="Previous PPDA Registration Certificate"
          id="previousPPDARegistrationCertificate"
          placeholder="Upload"
          icon={<IconUpload size={'1rem'} />}
          {...form.getInputProps(
            `supportingDocuments.previousPPDARegistrationCertificate`,
          )}
        />
      </Stack>

      <Stack my={15}>
        <FileInput
          label="MSME Certificate "
          id="mSMECertificate "
          placeholder="Upload"
          icon={<IconUpload size={'1rem'} />}
          {...form.getInputProps(`supportingDocuments.mSMECertificate `)}
        />
      </Stack>
    </>
  );
};
