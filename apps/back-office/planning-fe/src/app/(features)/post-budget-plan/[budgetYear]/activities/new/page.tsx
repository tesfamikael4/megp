'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/_components/activity-form-detail';
import { Tabs } from '@mantine/core';

export default function NewActivity() {
  return (
    <>
      <Section title="New">
        <Tabs defaultValue="definition">
          <Tabs.List>
            <Tabs.Tab value="definition">Definition</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="definition" className="pt-2">
            <FormDetail mode="new" page="post" />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
}
