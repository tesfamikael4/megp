'use client';
import { FormDetail } from '@/app/(features)/procurement-requisition/_components/mannual-pr';
import { Box, Container, Divider, Flex, Tabs, Tooltip } from '@mantine/core';
import { PrMechanization } from '@/app/(features)/procurement-requisition/_components/pr-mechanization';
import { Items } from '@/app/(features)/procurement-requisition/_components/items';
import TimelineTab from '@/app/(features)/procurement-requisition/_components/timeline-tab';
import { Requisitioner } from '@/app/(features)/procurement-requisition/_components/requisitioner';
import { Documents } from '../_components/documents';
import { useParams, useRouter } from 'next/navigation';
import { useReadQuery } from '../_api/procurement-requisition.api';
import { IconChevronLeft } from '@tabler/icons-react';

export default function PrDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data } = useReadQuery(id?.toString());
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
            <Tabs defaultValue="definition" keepMounted={false}>
              <Tabs.List className=" flex-nowrap">
                <Tabs.Tab value="definition">
                  Procurement Identification
                </Tabs.Tab>
                <Tabs.Tab value="method">Procurement Mechanism</Tabs.Tab>
                <Tabs.Tab value="items">Items</Tabs.Tab>
                <Tabs.Tab value="documents">Document</Tabs.Tab>
                <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="definition" className="pt-2">
                <FormDetail mode="detail" />
              </Tabs.Panel>

              <Tabs.Panel value="method" className="pt-2">
                <PrMechanization disableFields={!data?.isCustom} />
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
