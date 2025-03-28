'use client';
import {
  ActionIcon,
  Badge,
  Box,
  Container,
  Flex,
  Text,
  Tooltip,
} from '@mantine/core';
import { FormDetail } from '@/app/(features)/(app)/_components/activity-form-detail';
import { Documents } from '@/app/(features)/(app)/_components/documents';
import TimelineTab from '@/app/(features)/(app)/_components/timeline-tab';
import { Items } from '@/app/(features)/(app)/_components/items';
import { ActivityMechanization } from '@/app/(features)/(app)/_components/activity-mechanization';
import { useGetPreBudgetPlansQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useParams, useRouter } from 'next/navigation';
import { Requisitioner } from '@/app/(features)/(app)/_components/requisitioner';
import { IconChevronLeft, IconMessage2 } from '@tabler/icons-react';
import { useReadQuery } from '../_api/activities.api';
import { useDisclosure } from '@mantine/hooks';
import { Note } from '@/app/(features)/(app)/_components/note';
import { useEffect, useState } from 'react';

export default function NewActivity() {
  const { budgetYear, id } = useParams();
  const { data: planWithApp } = useGetPreBudgetPlansQuery({
    where: [[{ value: budgetYear, operator: '=', column: 'id' }]],
  });

  const [preBudgetYear, setPreBudgetYear] = useState<any>();
  const [opened, { toggle }] = useDisclosure(false);
  const { data: activity } = useReadQuery(id as string);
  const badgeColor = {
    Draft: 'yellow',
    Submitted: 'blue',
    Approved: 'green',
    Adjust: 'yellow',
    Adjusted: 'blue',
  };
  const router = useRouter();
  const disableFields = preBudgetYear
    ? preBudgetYear.status != 'Draft' && preBudgetYear.status != 'Adjust'
    : false;

  const [currentTab, setCurrentTab] = useState('identification');
  const activeTabStyle =
    'bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-gray-700 font-medium';
  const inActiveTabStyle =
    'cursor-pointer py-2 px-10 text-gray-700 font-medium';

  useEffect(() => {
    if (planWithApp && planWithApp.items.length > 0) {
      setPreBudgetYear(planWithApp.items[0]);
    }
  }, [planWithApp]);
  return (
    <>
      <Box className="bg-white -mt-5 -mx-5">
        <Container size="xl">
          <Flex className="px-2 pt-2" gap={10}>
            <Text className="text-xs font-semibold ml-4">
              {preBudgetYear?.app?.planName ?? ''}
            </Text>
            <Badge
              color={badgeColor[preBudgetYear?.status ?? 'Draft']}
              size="xs"
            >
              {preBudgetYear?.status ?? ''}
            </Badge>
          </Flex>
          <Flex justify="space-between" className="p-2">
            <Tooltip
              label="List Activities"
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              <Flex align="center">
                <IconChevronLeft size={14} />
                <Text className="font-semibold text-lg">
                  {activity?.name ?? ''}
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
            <Box
              className={
                currentTab === 'requisitioner'
                  ? activeTabStyle
                  : inActiveTabStyle
              }
              onClick={() => setCurrentTab('requisitioner')}
            >
              Requisitioner
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container size="xl">
        <Box className="mt-5">
          <Flex>
            {currentTab === 'identification' && (
              <FormDetail
                mode="detail"
                page="pre"
                disableFields={disableFields}
              />
            )}

            {currentTab === 'method' && (
              <ActivityMechanization page="pre" disableFields={disableFields} />
            )}

            {currentTab === 'items' && (
              <Items page="pre" disableFields={disableFields} />
            )}

            {currentTab === 'documents' && (
              <Documents disableFields={disableFields} page="pre" />
            )}

            {currentTab === 'timeline' && (
              <TimelineTab page="pre" disableFields={disableFields} />
            )}

            {currentTab === 'requisitioner' && (
              <Requisitioner page="pre" disableFields={disableFields} />
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
