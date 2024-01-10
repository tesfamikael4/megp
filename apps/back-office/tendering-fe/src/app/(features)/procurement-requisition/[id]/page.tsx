'use client';
import { FormDetail } from '@/app/(features)/procurement-requisition/_components/form-detail';
import { Box, Container, Divider, Tabs } from '@mantine/core';
import { Activities } from '@/app/(features)/_components/activity';
import { ActivityMechanization } from '@/app/(features)/_components/activity-mechanization';
import { Items } from '@/app/(features)/_components/items';
import TimelineTab from '@/app/(features)/_components/timeline-tab';
import { Requisitioner } from '@/app/(features)/_components/requisitioner';
import Despersment from '@/app/(features)/_components/dispersment';
import { Documents } from '../../_components/documents';

export default function PrDetailPage() {
  return (
    <>
      <Box className="bg-white rounded shadow-sm">
        <Box className="p-4">
          <div className="text-lg font-medium mt-4 pt-2">
            Procurement requisition details
          </div>

          <Divider mt={'md'} mb={'md'} />
          <Container fluid>
            <Tabs defaultValue="definition">
              <Tabs.List className=" flex-nowrap">
                <Tabs.Tab value="definition">Definition</Tabs.Tab>
                <Tabs.Tab value="activities">Activities</Tabs.Tab>
                <Tabs.Tab value="method">Method</Tabs.Tab>
                <Tabs.Tab value="items">Items</Tabs.Tab>
                <Tabs.Tab value="dispersement">Dispersement</Tabs.Tab>
                {/* <Tabs.Tab value="timeline">Timeline</Tabs.Tab> */}
                <Tabs.Tab value="documents">Document</Tabs.Tab>
                <Tabs.Tab value="requisitioner">Requisitioner</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="definition" className="pt-2">
                <FormDetail mode="detail" />
              </Tabs.Panel>

              <Tabs.Panel value="activities">
                <Activities />
              </Tabs.Panel>

              <Tabs.Panel value="method" className="pt-2">
                <ActivityMechanization />
              </Tabs.Panel>

              <Tabs.Panel value="items">
                <Items />
              </Tabs.Panel>

              <Tabs.Panel value="documents">
                <Documents />
              </Tabs.Panel>

              <Tabs.Panel value="dispersement">
                <Despersment />
              </Tabs.Panel>

              <Tabs.Panel value="timeline">
                <TimelineTab />
              </Tabs.Panel>

              <Tabs.Panel value="requisitioner">
                <Requisitioner />
              </Tabs.Panel>
            </Tabs>
          </Container>
        </Box>
      </Box>
    </>
  );
}
