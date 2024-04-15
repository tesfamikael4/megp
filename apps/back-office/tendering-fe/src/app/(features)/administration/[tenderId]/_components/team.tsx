'use client';
import { Section } from '@megp/core-fe';
import { Tabs } from '@mantine/core';
import { OpeningTeam } from './opening-team';
import { EnvelopTeam } from './envelope-team';
export const Team = () => {
  return (
    <>
      <Section title="Teams" className="mt-2" defaultCollapsed={false}>
        <Tabs defaultValue="opening">
          <Tabs.List>
            <Tabs.Tab value="opening">Opening Teams</Tabs.Tab>
            <Tabs.Tab value="evaluation">Evaluation Teams</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="opening" className="p-2">
            <OpeningTeam />
          </Tabs.Panel>
          <Tabs.Panel value="evaluation" className="p-2">
            <EnvelopTeam />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
};
