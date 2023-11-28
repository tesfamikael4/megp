'use client';
import { Tabs } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import { Documents } from '@/app/(features)/_components/documents';
import TimelineTab from '@/app/(features)/_components/timeline-tab';
import { Items } from '@/app/(features)/_components/items';

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
          </Tabs.List>

          <Tabs.Panel value="definition" className="pt-2">
            <FormDetail mode="detail" />
          </Tabs.Panel>

          <Tabs.Panel value="items">
            <Items />
          </Tabs.Panel>

          <Tabs.Panel value="documents">
            <Documents />
          </Tabs.Panel>

          <Tabs.Panel value="timeline">
            <TimelineTab />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
}
