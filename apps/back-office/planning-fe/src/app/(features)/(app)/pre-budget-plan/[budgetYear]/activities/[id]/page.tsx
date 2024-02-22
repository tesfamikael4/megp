'use client';
import { ActionIcon, Box, Flex, Tabs, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/(app)/_components/activity-form-detail';
import { Documents } from '@/app/(features)/(app)/_components/documents';
import TimelineTab from '@/app/(features)/(app)/_components/timeline-tab';
import { Items } from '@/app/(features)/(app)/_components/items';
import { ActivityMechanization } from '@/app/(features)/(app)/_components/activity-mechanization';
import { useGetPreBudgetPlanQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useParams, useRouter } from 'next/navigation';
import { Requisitioner } from '@/app/(features)/(app)/_components/requisitioner';
import { IconChevronLeft, IconMessage2 } from '@tabler/icons-react';
import { useReadQuery } from '../_api/activities.api';
import { useDisclosure } from '@mantine/hooks';
import { Note } from '@/app/(features)/(app)/_components/note';

export default function NewActivity() {
  const { budgetYear, id } = useParams();
  const { data: preBudgetYear } = useGetPreBudgetPlanQuery(
    budgetYear as string,
  );
  const [opened, { toggle }] = useDisclosure(false);
  const { data: activity } = useReadQuery(id as string);
  const router = useRouter();
  const disableFields = preBudgetYear
    ? preBudgetYear.status != 'Draft' && preBudgetYear.status != 'Adjust'
    : false;
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
        collapsible={false}
        action={
          <Tooltip label="Note">
            <ActionIcon variant="subtle" onClick={toggle}>
              <IconMessage2 size={18} color="gray" />
            </ActionIcon>
          </Tooltip>
        }
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
              <Tabs.Tab value="requisitioner">Requisitioner</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="identification" className="pt-2">
              <FormDetail
                mode="detail"
                page="pre"
                disableFields={disableFields}
              />
            </Tabs.Panel>
            <Tabs.Panel value="method" className="pt-2">
              <ActivityMechanization page="pre" disableFields={disableFields} />
            </Tabs.Panel>

            <Tabs.Panel value="items">
              <Items page="pre" disableFields={disableFields} />
            </Tabs.Panel>

            <Tabs.Panel value="documents">
              <Documents disableFields={disableFields} />
            </Tabs.Panel>

            <Tabs.Panel value="timeline">
              <TimelineTab page="pre" disableFields={disableFields} />
            </Tabs.Panel>

            <Tabs.Panel value="requisitioner">
              <Requisitioner page="pre" disableFields={disableFields} />
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
