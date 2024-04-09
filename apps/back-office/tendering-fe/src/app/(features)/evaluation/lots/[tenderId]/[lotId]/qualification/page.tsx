'use client';

import { BidderOverView } from '@/app/(features)/opening/[tenderId]/bidders/_components/bidder-overview';
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
        <Box className="ml-2">
          <DataTable
            records={record.subChecklist}
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
      title: 'Legal Qualification',
      status: 'checked',
      subChecklist: [
        {
          id: 1,
          title: 'Nationality in accordance with ITB Sub-Clause 4.2',
          status: 'checked',
        },
        {
          id: 2,
          title: 'No conflict of interest as described in ITB Clause 4.3',
          status: 'checked',
        },
        {
          id: 3,
          title:
            'Having been submitted valid tax clearance certificate issued by the tax authority (Domestic Bidders Only) in accordance with ITB Clause 4.6(b)(iii)',
          status: 'checked',
        },
      ],
    },
    {
      id: 2,
      title: 'Professional Qualification',
      status: 'checked',
      subChecklist: [
        {
          id: 1,
          title: 'At least staff currently work for the Bidder.',
          status: 'checked',
        },
        {
          id: 2,
          title:
            'Among the staff mentioned in Sub-Clause 2.1 Bidder must demonstrate that it will have the personnel for the key positions that meet the following requirements',
          status: 'checked',
        },
      ],
    },
    {
      id: 3,
      title: 'Technical Qualification',
      status: 'draft',
      subChecklist: [
        {
          id: 1,
          title:
            'Bidder has to provide in the Bid Submission Sheet Form the Statement attesting the origin of the Goods and Related Services offered',
          status: 'checked',
        },
        {
          id: 2,
          title:
            'Bidder has to provide in the Bidder Certification of Compliance Form information about major relevant contracts successfully completed in the number and period specified in the BDS',
          status: 'draft',
        },
        {
          id: 2,
          title:
            'Bidder has to submit Certificates of satisfactory execution of contracts provided by contracting parties to the contracts successfully completed in the period and budget as specified in the BDS Clause 16.3',
          status: 'draft',
        },
      ],
    },
    {
      id: 4,
      title: 'Financial Qualification',
      status: 'draft',
      subChecklist: [
        {
          id: 1,
          title:
            'Bidder has to submit financial statements certified by an independent auditor as required in ITB Clause 15.2(a) for the period specified in Section 3, Evaluation Methodology and Criteria',
          status: 'draft',
        },
        {
          id: 2,
          title:
            'Bidder has to submit other documents proofing its financial standing, as required in the BDS Clause 15.2',
          status: 'draft',
        },
      ],
    },
    {
      id: 5,
      title: 'Performance Qualification',
      status: 'draft',
      subChecklist: [],
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
