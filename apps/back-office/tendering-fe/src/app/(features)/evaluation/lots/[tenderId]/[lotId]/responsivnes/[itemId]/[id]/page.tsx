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
import {
  IconAlertCircle,
  IconChevronRight,
  IconCircleCheck,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';

export default function BiderDetail() {
  const config: ExpandableTableConfig = {
    isExpandable: true,
    expandedRowContent: (record) => {
      return (
        <Box className="ml-5">
          <DataTable
            records={checklistData}
            columns={config.columns}
            noHeader={true}
            rowExpansion={{
              content: ({ record }) => (
                <Box className="pl-5 bg-white">
                  <DataTable
                    records={checklistData}
                    columns={[
                      {
                        accessor: 'title',
                        render: (record) => {
                          return record.status === 'checked' ? (
                            record.title
                          ) : (
                            <Text className="text-sm font-semibold">
                              {record.title}
                            </Text>
                          );
                        },
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
                    ]}
                    noHeader={true}
                  />
                </Box>
              ),
            }}
          />
        </Box>
      );
    },
    columns: [
      {
        accessor: 'id',
        title: '',
        width: 20,
        render: () => <IconChevronRight size={14} />,
      },
      {
        accessor: 'title',
        render: (record) => {
          return record.status === 'checked' ? (
            record.title
          ) : (
            <Text className="text-sm font-semibold">{record.title}</Text>
          );
        },
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
      id: 1,
      title:
        'Internal auditor as independent party have been invited to witness the bid opening ceremony.',
      status: 'checked',
    },
    {
      id: 2,
      title: 'Other interested observers attended the bid opening ceremony.',
      status: 'checked',
    },
    {
      id: 3,
      title:
        'Registered representatives from mass media attending the bid opening ceremony',
      status: 'draft',
    },
    {
      id: 4,
      title: 'The Bid Opening Team has opened each bid',
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
