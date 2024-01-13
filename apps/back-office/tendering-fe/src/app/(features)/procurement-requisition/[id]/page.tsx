'use client';
import { FormDetail } from '@/app/(features)/procurement-requisition/_components/form-detail';
import { Box, Container, Divider, Flex, Tabs, Tooltip } from '@mantine/core';
import { Activities } from '@/app/(features)/_components/activity';
import { ActivityMechanization } from '@/app/(features)/_components/pr-mechanization';
import { Items } from '@/app/(features)/_components/items';
import TimelineTab from '@/app/(features)/_components/timeline-tab';
import { Requisitioner } from '@/app/(features)/_components/requisitioner';
import Despersment from '@/app/(features)/_components/dispersment';
import { Documents } from '../../_components/documents';
import { useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';

export default function PrDetailPage() {
  const router = useRouter();
  return (
    <>
      <Box className="bg-white rounded shadow-sm">
        <div className="text-lg font-medium mt-4 pt-4 pb-4">
          <Tooltip
            label="List Procurement requisition"
            className="cursor-pointer"
            onClick={() => router.push(`/procurement-requisition`)}
            position="top-start"
          >
            <Flex align="center">
              <IconChevronLeft />
              Procurement requisition details
            </Flex>
          </Tooltip>
        </div>
        <Box className="">
          <Divider mb={'md'} />
          <Container fluid>
            <Tabs defaultValue="definition">
              <Tabs.List className=" flex-nowrap">
                <Tabs.Tab value="definition">Definition</Tabs.Tab>
                <Tabs.Tab value="activities">Activities</Tabs.Tab>
                <Tabs.Tab value="method">Method</Tabs.Tab>
                <Tabs.Tab value="items">Items</Tabs.Tab>
                <Tabs.Tab value="dispersement">Dispersement</Tabs.Tab>
                <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
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
