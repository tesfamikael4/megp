'use client';

import { BidderOverView } from '@/app/(features)/opening/[tenderId]/bidders/_components/bidder-overview';
import { useLazyGetBidOpeningChecklistByLotIdQuery } from '@/store/api/tendering/tendering.api';
import {
  Box,
  Button,
  Flex,
  Group,
  Select,
  Text,
  Textarea,
} from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function BiderDetail() {
  const { lotId, bidderId } = useParams();
  const config: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'name',
        render: (record) =>
          record.check ? (
            record.title
          ) : (
            <Text className="text-sm font-semibold">{record.name}</Text>
          ),
      },
      {
        accessor: 'status',
        title: '',
        width: 50,
        render: (record) =>
          record.check ? (
            <IconCircleCheck size={18} color="green" />
          ) : (
            <IconAlertCircle size={18} color="red" />
          ),
      },
    ],
  };
  const [getChecklists, { data: checklistData }] =
    useLazyGetBidOpeningChecklistByLotIdQuery();

  useEffect(() => {
    getChecklists({ lotId: lotId as string, bidderId: bidderId as string });
  }, []);
  return (
    <>
      <BidderOverView />
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-1/4">
          <Section
            title="Bid Attributes"
            className="h-full"
            collapsible={false}
          >
            <ExpandableTable config={config} data={checklistData ?? []} />
          </Section>
        </Box>
        <Box className=" bg-white w-2/4">
          <Section
            title="The Bid Opening Team has opened each bid"
            collapsible={false}
            className="h-full overflow-scroll"
          >
            <embed
              src={'https://arxiv.org/pdf/1708.08021.pdf'}
              type="application/pdf"
              width="100%"
              height="400px"
            />
          </Section>
        </Box>
        <Box className=" bg-white w-1/4">
          <Section
            title="Bidder Checklist"
            collapsible={false}
            className="h-full"
          >
            <Select label="Assessment" data={['Yes', 'No']} withAsterisk />
            <Textarea autosize label="Remark" mt={10} minRows={7} />
            <Group justify="end" mt={10}>
              <Button>Save</Button>
            </Group>
          </Section>
        </Box>
      </Flex>
    </>
  );
}
