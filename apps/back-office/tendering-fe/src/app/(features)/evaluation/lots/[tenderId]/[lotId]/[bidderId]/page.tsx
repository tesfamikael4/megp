'use client';

import { BidderOverView } from '@/app/(features)/opening/[id]/_components/bidder-overview';
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

export default function BiderDetail() {
  const config: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'title',
        render: (record) =>
          record.status === 'checked' ? (
            record.title
          ) : (
            <Text className="text-sm font-semibold">{record.title}</Text>
          ),
      },
      {
        accessor: 'status',
        title: '',
        width: 50,
        render: (record) =>
          record.status === 'checked' ? (
            <IconCircleCheck size={18} color="green" />
          ) : (
            <IconAlertCircle size={18} color="red" />
          ),
      },
    ],
  };
  const checklistData = [
    {
      title: 'Bid is written in language specified in the ITB Clause 11.1',
      status: 'checked',
    },
    {
      title: 'Bidder has to submit Bid Submission Sheet Form',
      status: 'checked',
    },
    {
      title: 'Bidder has to submit Bidder Certification of Compliance Form',
      status: 'draft',
    },
    {
      title:
        'Bidder has to submit signed and dated Technical Specification + Technical Offer+ Compliance Sheet Form',
      status: 'draft',
    },
    {
      title: 'Bidder has to submit Bid Security',
      status: 'draft',
    },
    {
      title: 'The Bid Security is in accordance with ITB Clause 22',
      status: 'draft',
    },
  ];
  return (
    <>
      <BidderOverView />
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-1/4">
          <Section
            title="Assessment Criteria"
            className="h-full"
            collapsible={false}
          >
            <ExpandableTable config={config} data={checklistData} />
          </Section>
        </Box>
        <Box className=" bg-white w-2/4">
          <Section
            title="Bid Document"
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
