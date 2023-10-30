import { Flex } from '@mantine/core';
import React from 'react';
import UppyAttachmentDashboard from '../../../_components/UppyAttachmentDashboard/UppyAttachmentDashboard';

function Page() {
  return (
    <Flex className="w-full flex-col gap-2">
      <UppyAttachmentDashboard
        tusServerUrl="http://localhost:3000/api/upload/files/"
        id="businessRegistration_IncorporationCertificate"
        label="Business Registration/Incorporation Certificate"
        placeholder="Upload"
      />
      <UppyAttachmentDashboard
        tusServerUrl="http://localhost:3000/api/upload/files/"
        id="mRA_TPINCertificate"
        label="MRA TPIN Certificate"
        placeholder="Upload"
      />
      <UppyAttachmentDashboard
        tusServerUrl="http://localhost:3000/api/upload/files/"
        id="generalReceipt_BankDepositSlip"
        label="General Receipt/Bank Deposit Slip"
        placeholder="Upload"
      />
      <UppyAttachmentDashboard
        tusServerUrl="http://localhost:3000/api/upload/files/"
        id="mRATaxClearanceCertificate"
        label="MRA Tax Clearance Certificate"
        placeholder="Upload"
      />
      <UppyAttachmentDashboard
        tusServerUrl="http://localhost:3000/api/upload/files/"
        id="previousPPDARegistrationCertificate"
        label="Previous PPDA Registration Certificate"
        placeholder="Upload"
      />
    </Flex>
  );
}

export default Page;
