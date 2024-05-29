'use client';
import { FormDetail } from '@/app/(features)/procurement-requisition/_components/mannual-pr';
import { Box, Container, Text, Flex, Tooltip, ActionIcon } from '@mantine/core';
import { ActivityMechanization } from '@/app/(features)/(app)/_components/activity-mechanization';
import { Items } from '@/app/(features)/procurement-requisition/_components/items';
import TimelineTab from '@/app/(features)/procurement-requisition/_components/timeline-tab';
import { Documents } from '@/app/(features)/(app)/_components/documents';
import { useParams, useRouter } from 'next/navigation';
import { useReadQuery } from '@/store/api/pr/pr.api';
import { IconChevronLeft, IconMessage2 } from '@tabler/icons-react';
import { Note } from '../../(app)/_components/note';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export default function PrDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isSuccess: succeed } = useReadQuery(id?.toString());
  const [opened, { toggle }] = useDisclosure(false);
  const [currentTab, setCurrentTab] = useState('identification');
  const [disableFields, setDisableFields] = useState<any>(false);

  const activeTabStyle =
    'bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-gray-700 font-medium';
  const inActiveTabStyle =
    'cursor-pointer py-2 px-10 text-gray-700 font-medium';

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
            <Tooltip label="Note">
              <ActionIcon variant="subtle" onClick={toggle}>
                <IconMessage2 size={18} color="gray" />
              </ActionIcon>
            </Tooltip>
          </Flex>
          <Flex gap={10} className="mt-2 ml-2">
            <Box
              className={
                currentTab === 'identification'
                  ? activeTabStyle
                  : inActiveTabStyle
              }
              onClick={() => setCurrentTab('identification')}
            >
              Identification
            </Box>
            <Box
              className={
                currentTab === 'method' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('method')}
            >
              Procurement Methods
            </Box>
            <Box
              className={
                currentTab === 'items' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('items')}
            >
              Items
            </Box>
            <Box
              className={
                currentTab === 'documents' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('documents')}
            >
              Documents
            </Box>
            <Box
              className={
                currentTab === 'timeline' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('timeline')}
            >
              Timeline
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container size="xl">
        <Box className="mt-5 -mx-4  ">
          <Flex>
            {currentTab === 'identification' && (
              <FormDetail mode="detail" disableFields={disableFields} />
            )}

            {currentTab === 'method' && (
              <ActivityMechanization
                disableFields={disableFields}
                page={'pr'}
              />
            )}

            {currentTab === 'items' && <Items disableFields={disableFields} />}

            {currentTab === 'documents' && (
              <Documents page="pr" disableFields={disableFields} />
            )}

            {currentTab === 'timeline' && (
              <TimelineTab disableFields={disableFields} />
            )}

            {opened && (
              <Box className="w-2/4 ml-2">
                <Note />
              </Box>
            )}
          </Flex>
        </Box>
      </Container>
    </>
  );
}
