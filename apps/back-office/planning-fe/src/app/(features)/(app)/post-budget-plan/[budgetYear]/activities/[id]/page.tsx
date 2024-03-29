'use client';
import {
  ActionIcon,
  Badge,
  Box,
  Container,
  Flex,
  Tabs,
  Text,
  Tooltip,
} from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/(app)/_components/activity-form-detail';
import { Items } from '@/app/(features)/(app)/_components/items';
import TimelineTab from '@/app/(features)/(app)/_components/timeline-tab';
import { BudgetTab } from '../_components/budget-tab';
import { Documents } from '@/app/(features)/(app)/_components/documents';
import { ActivityMechanization } from '@/app/(features)/(app)/_components/activity-mechanization';
import { Requisitioner } from '@/app/(features)/(app)/_components/requisitioner';
import { IconChevronLeft, IconMessage2 } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useReadQuery } from '../_api/activities.api';
import {
  useGetPostBudgetPlanQuery,
  useGetPostBudgetPlansQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';
import { Note } from '../../../../_components/note';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export default function NewActivity() {
  const { budgetYear, id } = useParams();
  // const { data: postBudget } = useGetPostBudgetPlanQuery(budgetYear as string);
  const { data: planWithApp } = useGetPostBudgetPlansQuery({
    where: [[{ value: budgetYear, operator: '=', column: 'id' }]],
  });
  const [postBudget, setPostBudget] = useState<any>();
  const { data: activity } = useReadQuery(id as string);
  const [opened, { toggle }] = useDisclosure(false);

  const disableFields = postBudget
    ? postBudget.status != 'Draft' && postBudget.status != 'Adjust'
    : false;

  const badgeColor = {
    Draft: 'yellow',
    Submitted: 'blue',
    Approved: 'green',
    Adjust: 'yellow',
    Adjusted: 'blue',
  };

  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('identification');
  const activeTabStyle =
    'bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-8 rounded-t text-gray-700 font-medium';
  const inActiveTabStyle = 'cursor-pointer py-2 px-8 text-gray-700 font-medium';

  useEffect(() => {
    if (planWithApp && planWithApp.items.length > 0) {
      setPostBudget(planWithApp.items[0]);
    }
  }, [planWithApp]);
  return (
    <>
      <Box className="bg-white -mt-5 -mx-5">
        <Container size="xl">
          <Flex className="px-2 pt-2" gap={10}>
            <Text className="text-xs font-semibold ml-4">
              {postBudget?.app?.planName ?? ''}
            </Text>
            <Badge color={badgeColor[postBudget?.status ?? 'Draft']} size="xs">
              {postBudget?.status ?? ''}
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
              Activity Identification
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
                currentTab === 'budget' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('budget')}
            >
              Budget
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
                page="post"
                disableFields={disableFields}
              />
            )}

            {currentTab === 'method' && (
              <ActivityMechanization
                page="post"
                disableFields={disableFields}
              />
            )}

            {currentTab === 'items' && (
              <Items page="post" disableFields={disableFields} />
            )}

            {currentTab === 'documents' && (
              <Documents disableFields={disableFields} page="post" />
            )}

            {currentTab === 'timeline' && (
              <TimelineTab page="post" disableFields={disableFields} />
            )}

            {currentTab === 'budget' && (
              <BudgetTab disableFields={disableFields} />
            )}

            {currentTab === 'requisitioner' && (
              <Requisitioner page="post" disableFields={disableFields} />
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
