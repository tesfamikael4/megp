'use client';
import { Flex, Tabs, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/_components/activity-form-detail';
import { Items } from '@/app/(features)/_components/items';
import TimelineTab from '@/app/(features)/_components/timeline-tab';
import { BudgetTab } from '../_components/budget-tab';
import { Documents } from '@/app/(features)/_components/documents';
import { ActivityMechanization } from '@/app/(features)/_components/activity-mechanization';
import { Requisitioner } from '@/app/(features)/_components/requisitioner';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';

export default function NewActivity() {
  const { budgetYear } = useParams();
  const router = useRouter();
  return (
    <>
      <Section
        title={
          <Tooltip
            label="List Activities"
            className="cursor-pointer"
            onClick={() =>
              router.push(`/pre-budget-plan/${budgetYear}/activities`)
            }
          >
            <Flex align="center">
              <IconChevronLeft />
              Activities
            </Flex>
          </Tooltip>
        }
      >
        <Tabs defaultValue="identification">
          <Tabs.List>
            <Tabs.Tab value="identification">Identification</Tabs.Tab>
            <Tabs.Tab value="method">Procurement Methods</Tabs.Tab>
            <Tabs.Tab value="items">Items</Tabs.Tab>
            <Tabs.Tab value="documents">Documents</Tabs.Tab>
            <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
            <Tabs.Tab value="budget">Budget</Tabs.Tab>
            <Tabs.Tab value="requisitioner">Requisitioner</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="identification" className="pt-2">
            <FormDetail mode="detail" page="post" />
          </Tabs.Panel>
          <Tabs.Panel value="method" className="pt-2">
            <ActivityMechanization page="post" />
          </Tabs.Panel>

          <Tabs.Panel value="items">
            <Items page="post" />
          </Tabs.Panel>

          <Tabs.Panel value="documents">
            <Documents />
          </Tabs.Panel>

          <Tabs.Panel value="timeline">
            <TimelineTab page="post" />
          </Tabs.Panel>

          <Tabs.Panel value="budget">
            <BudgetTab />
          </Tabs.Panel>
          <Tabs.Panel value="requisitioner">
            <Requisitioner page="post" />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
}
