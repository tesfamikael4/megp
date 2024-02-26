'use client';
import { Box, Flex, Text } from '@mantine/core';
import { useGetVendorQuery } from '../../_api/query';
import DocumentCard from './document-card';

function MyCertificates() {
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const fileNames: { [key: string]: string } = {
    businessRegistration_IncorporationCertificate:
      'Business Registration Incorporation Certificate',
    mRA_TPINCertificate: 'MRA TPIN Certificate',
  };

  return (
    <Box>
      <Box className=" w-full mb-4 bg-white">
        <Flex className="w-full py-2 gap-1 items-center">
          <Text fw={700} fz="md">
            My Certificates
          </Text>
        </Flex>
        <Box className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {requestInfo.data &&
            requestInfo.data.supportingDocuments &&
            Object.entries(fileNames)
              .map(([key, value]) => ({
                label: fileNames[key], // replace underscores with spaces for labels
                value: requestInfo?.data?.supportingDocuments[key],
                key,
              }))
              .map((data, index) => (
                <DocumentCard key={index} data={data} canDelete={true} />
              ))}
        </Box>
      </Box>
    </Box>
  );
}

export default MyCertificates;
