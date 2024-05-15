'use client';
import { Box, Container, Flex, Tooltip, Text } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';
import { useReadQuery } from '../_api/contract.api';

export default function ContractHeader({ currentTab }: { currentTab: any }) {
  const { id } = useParams();

  const { data } = useReadQuery(id?.toString());

  const router = useRouter();
  const activeTabStyle =
    'bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-gray-700 font-medium';
  const inActiveTabStyle =
    'cursor-pointer py-2 px-10 text-gray-700 font-medium';

  return (
    <>
      <Box className="bg-white -mt-4 -mr-4 -ml-4  ">
        <Container size="xl" className="bg-white -ml-5  -mr-9  -my-3 w-full">
          <Flex justify="space-between" className="p-2">
            <Tooltip
              label="List Activities"
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              <Flex align="center">
                <IconChevronLeft size={14} />
                <Text className="font-semibold text-lg">
                  {data?.contractTitle ?? ''}
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
          <Flex gap={10} className="mt-2 ml-2">
            <Box
              className={
                currentTab === 'identification'
                  ? activeTabStyle
                  : inActiveTabStyle
              }
              onClick={() => {
                router.push(`/contract-catalogs/${id}`);
              }}
            >
              Identification
            </Box>

            <Box
              className={
                currentTab === 'contractItem'
                  ? activeTabStyle
                  : inActiveTabStyle
              }
              onClick={() => router.push(`/contract-catalogs/${id}/items`)}
            >
              Contract Items
            </Box>

            <Box
              className={
                currentTab === 'beneficiary' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() =>
                router.push(`/contract-catalogs/${id}/beneficiary`)
              }
            >
              beneficiary
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
