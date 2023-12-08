'use client';
import { Tabs } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/_components/activity-form-detail';
import { Items } from '@/app/(features)/_components/items';
import TimelineTab from '@/app/(features)/_components/timeline-tab';
import { BudgetTab } from '../_components/budget-tab';
import { Documents } from '@/app/(features)/_components/documents';

export default function NewActivity() {
  return (
    <>
      <Section title="Activity">
        <Tabs defaultValue="definition">
          <Tabs.List>
            <Tabs.Tab value="definition">Definition</Tabs.Tab>
            <Tabs.Tab value="items">Items</Tabs.Tab>
            <Tabs.Tab value="documents">Documents</Tabs.Tab>
            <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
            <Tabs.Tab value="budget">Budget</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="definition" className="pt-2">
            <FormDetail mode="detail" page="post" />
          </Tabs.Panel>

          <Tabs.Panel value="items">
            <Items />
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
        </Tabs>
      </Section>
    </>
  );
}
