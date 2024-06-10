'use client';
import { ActionIcon, Badge, Stack } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import BiddderComplianceDetail from '../../_component/bidder-compliance-detail.component';
import { useParams, useRouter } from 'next/navigation';
import { IconChevronRight } from '@tabler/icons-react';
import RFXHeader from '../../_component/rfx-header';
import { useLazyGetBiddersListQuery } from '@/store/api/rfx/rfx.api';
import { CollectionQuery } from '@megp/entity';

export default function EvaluationDetailPage() {
  const router = useRouter();
  const { id, assessmentMode } = useParams();

  const [trigger, { data: biddersList, isLoading }] =
    useLazyGetBiddersListQuery();

  const config = {
    columns: [
      { accessor: 'vendorName', title: 'Name' },
      {
        accessor: 'status',
        width: 250,
        render: (record) =>
          record?.isEvaluationCompleted == 1 ? (
            <Badge color="green">Completed</Badge>
          ) : (
            <Badge color="yellow">In progress</Badge>
          ),
      },
      {
        accessor: 'action',
        title: '',
        width: 70,
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/evaluation/${id}/${assessmentMode}/${record?.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
      },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'title',
    isLoading,
    expandedRowContent: (bidder) => {
      return <BiddderComplianceDetail bidder={bidder} />;
    },
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      rfxId: id.toString(),
      isTeamAssessment: assessmentMode == 'team' ? true : false,
      collectionQuery: { ...request },
    });
  };

  return (
    <Stack>
      <RFXHeader />
      <Section title={'Bidders List'} collapsible={false}>
        <ExpandableTable
          config={config}
          data={biddersList?.items ?? []}
          onRequestChange={onRequestChange}
          total={biddersList?.total ?? 0}
        />
      </Section>
    </Stack>
  );
}
