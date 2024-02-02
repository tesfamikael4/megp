'use client';
import { Flex, Tabs, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/_components/activity-form-detail';
import { Documents } from '@/app/(features)/_components/documents';
import TimelineTab from '@/app/(features)/_components/timeline-tab';
import { Items } from '@/app/(features)/_components/items';
import { ActivityMechanization } from '@/app/(features)/_components/activity-mechanization';
import { useParams, useRouter } from 'next/navigation';
import { Requisitioner } from '@/app/(features)/_components/requisitioner';
import { IconChevronLeft } from '@tabler/icons-react';
import { useReadQuery } from '../_api/activities.api';

export default function NewActivity() {
  const { budgetYear, id } = useParams();
  const { data: activity } = useReadQuery(id as string);
  const router = useRouter();
  return (
    <>
      <Section
        title={
          <Tooltip
            label="List Activities"
            className="cursor-pointer"
            onClick={() => router.push(`/report/${budgetYear}/activities`)}
          >
            <Flex align="center">
              <IconChevronLeft />
              {activity?.name ?? ''}
            </Flex>
          </Tooltip>
        }
        collapsible={false}
      >
        <Tabs defaultValue="identification" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="identification">Identification</Tabs.Tab>
            <Tabs.Tab value="method">Procurement Methods</Tabs.Tab>
            <Tabs.Tab value="items">Items</Tabs.Tab>
            <Tabs.Tab value="documents">Documents</Tabs.Tab>
            <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
            <Tabs.Tab value="requisitioner">Requisitioner</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="identification" className="pt-2">
            <FormDetail mode="detail" page="pre" disableFields={true} />
          </Tabs.Panel>
          <Tabs.Panel value="method" className="pt-2">
            <ActivityMechanization page="pre" disableFields={true} />
          </Tabs.Panel>

          <Tabs.Panel value="items">
            <Items page="pre" disableFields={true} />
          </Tabs.Panel>

          <Tabs.Panel value="documents">
            <Documents disableFields={true} />
          </Tabs.Panel>

          <Tabs.Panel value="timeline">
            <TimelineTab page="pre" disableFields={true} />
          </Tabs.Panel>

          <Tabs.Panel value="requisitioner">
            <Requisitioner page="pre" disableFields={true} />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
}
