'use client';
import { Box, Container, Text, Flex, Tooltip } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useReadQuery } from '@/store/api/pr/pr.api';
import { IconChevronLeft } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Requisitioner } from '../../(app)/_components/requisitioner';

export default function PrDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isSuccess: succeed } = useReadQuery(id?.toString());
  const [currentTab, setCurrentTab] = useState('Technical Team');
  const [disableFields, setDisableFields] = useState<any>(false);

  const activeTabStyle =
    'bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-gray-700 font-medium';

  useEffect(() => {
    succeed &&
      setDisableFields(
        data?.status.toLowerCase() != 'draft' &&
          data?.status.toLowerCase() != 'Adjust'
          ? true
          : false,
      );
  }, [data, succeed]);

  return (
    <>
      <Box className="bg-white mt-5 ">
        <Container size="xl">
          <Flex justify="space-between" className="p-2">
            <Tooltip
              label="List Activities"
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              <Flex align="center">
                <IconChevronLeft size={14} />
                <Text className="font-semibold text-lg">
                  {data?.name ?? ''}
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
          <Flex gap={10} className="mt-2 ml-2">
            <Box
              className={activeTabStyle}
              onClick={() => setCurrentTab('Technical Team')}
            >
              Technical Team
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container size="xl">
        <Box className="mt-5 -mx-4  ">
          {currentTab === 'Technical Team' && (
            <Requisitioner page="pr" disableFields={disableFields} />
          )}
        </Box>
      </Container>
    </>
  );
}
