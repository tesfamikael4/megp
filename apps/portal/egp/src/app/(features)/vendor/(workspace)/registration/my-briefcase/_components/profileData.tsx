'use client';
import { Box, Flex, Text } from '@mantine/core';
import { useGetVendorQuery } from '../../_api/query';
import DocumentCard from './document-card';

function ProfileData() {
  const { data } = useGetVendorQuery({}, { refetchOnMountOrArgChange: true });

  const fileNames: { [key: string]: string } = {
    businessRegistration_IncorporationCertificate:
      'Business Registration Incorporation Certificate',
    mRA_TPINCertificate: 'MRA TPIN Certificate',
    mRATaxClearanceCertificate: 'MRA Tax Clearance Certificate',
    generalReceipt_BankDepositSlip: 'General Receipt Bank Deposit Slip',
    previousPPDARegistrationCertificate:
      'Previous PPDA Registration Certificate',
  };

  return (
    <Box>
      <Box className=" w-full mb-4 bg-white">
        <Flex className="w-full py-2 gap-1 items-center">
          <Text fw={700} fz="md">
            Supporting Documents
          </Text>
        </Flex>
        <Box className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {data &&
            data.supportingDocuments &&
            (Object.entries(fileNames)
              .map(([key, value]) => ({
                label: fileNames[key].replace(/_/g, ' '),
                value: data?.supportingDocuments[key],
                key,
              }))
              .filter((data) => data.value !== '').length > 0 ? (
              Object.entries(fileNames)
                .map(([key, value]) => ({
                  label: fileNames[key].replace(/_/g, ' '),
                  value: data?.supportingDocuments[key],
                  key,
                }))
                .filter((data) => data.value !== '')
                .map((data, index) => (
                  <DocumentCard key={index} data={data} canDelete={true} />
                ))
            ) : (
              <p>No Supporting Documents</p>
            ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileData;
