'use client';
import { ActionIcon, Box, Flex, Tabs, Tooltip } from '@mantine/core';
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
import { useGetPostBudgetPlanQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import { Note } from '../_components/note';
import { useDisclosure } from '@mantine/hooks';

export default function NewActivity() {
  const { budgetYear, id } = useParams();
  const { data: postBudget } = useGetPostBudgetPlanQuery(budgetYear as string);
  const { data: activity } = useReadQuery(id as string);
  const [opened, { toggle }] = useDisclosure(false);

  const disableFields = postBudget
    ? postBudget.status != 'Draft' && postBudget.status != 'Adjust'
    : false;

  const router = useRouter();
  return (
    <>
      <Section
        title={
          <Tooltip
            label="List Activities"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <Flex align="center">
              <IconChevronLeft />
              {activity?.name ?? ''}
            </Flex>
          </Tooltip>
        }
        action={
          <Tooltip label="Note">
            <ActionIcon variant="subtle" onClick={toggle}>
              <IconMessage2 />
            </ActionIcon>
          </Tooltip>
        }
        collapsible={false}
      >
        <Flex>
          <Tabs
            defaultValue="identification"
            keepMounted={false}
            className="w-full"
          >
            <Tabs.List>
              <Tabs.Tab value="identification">
                Activity Identification
              </Tabs.Tab>
              <Tabs.Tab value="method">Procurement Methods</Tabs.Tab>
              <Tabs.Tab value="items">Items</Tabs.Tab>
              <Tabs.Tab value="documents">Documents</Tabs.Tab>
              <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
              <Tabs.Tab value="budget">Budget</Tabs.Tab>
              <Tabs.Tab value="requisitioner">Requisitioner</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="identification" className="pt-2">
              <FormDetail
                mode="detail"
                page="post"
                disableFields={disableFields}
              />
            </Tabs.Panel>
            <Tabs.Panel value="method" className="pt-2">
              <ActivityMechanization
                page="post"
                disableFields={disableFields}
              />
            </Tabs.Panel>

            <Tabs.Panel value="items">
              <Items page="post" disableFields={disableFields} />
            </Tabs.Panel>

            <Tabs.Panel value="documents">
              <Documents disableFields={disableFields} />
            </Tabs.Panel>

            <Tabs.Panel value="timeline">
              <TimelineTab page="post" disableFields={disableFields} />
            </Tabs.Panel>

            <Tabs.Panel value="budget">
              <BudgetTab disableFields={disableFields} />
            </Tabs.Panel>
            <Tabs.Panel value="requisitioner">
              <Requisitioner page="post" disableFields={disableFields} />
            </Tabs.Panel>
          </Tabs>
          {opened && (
            <Box className="w-2/4 p-2 ">
              <Note />
            </Box>
          )}
        </Flex>
      </Section>
    </>
  );
}
