'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
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
            <FormDetail mode="new" />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
}
