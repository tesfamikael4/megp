'use client';
import { Box, Flex, Text } from '@mantine/core';
import { useGetVendorQuery } from '../../_api/query';
import DocumentCard from './document-card';
import { IconFile3d } from '@tabler/icons-react';

function MyCertificates() {
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const fileNames: { [key: string]: string } = {};

  return (
    <Box>
      <Box className=" w-full mb-4 bg-white">
        <Flex className="w-full py-2 gap-1 items-center">
          <Text fw={700} fz="md">
            My Certificates
          </Text>
        </Flex>
        <Box className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {requestInfo.data && requestInfo.data.businessAreas.length > 0 ? (
            Object.entries(fileNames)
              .map(([key, value]) => ({
                label: fileNames[key],
                value: requestInfo?.data?.supportingDocuments[key],
                key,
              }))
              .map((data, index) => (
                <DocumentCard key={index} data={data} canDelete={true} />
              ))
          ) : (
            <Flex
              gap={'sm'}
              justify={'center'}
              w={'100%'}
              h={'100%'}
              p={10}
              direction={'column'}
            >
              {/* <IconFile3d size={20} className="mr-2" stroke={1} /> */}
              <Text>No Certificates Found</Text>
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MyCertificates;
