'use client';

import { ActionIcon, Text } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyGetLotsByTenderIdQuery } from '@/store/api/tendering/tendering.api';
import { TenderOverView } from '../_components/tender-overview';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId } = useParams();
  const [getLots, { data: lots, isLoading }] = useLazyGetLotsByTenderIdQuery();
  const config: ExpandableTableConfig = {
    isLoading: isLoading,
    isSearchable: true,
    columns: [
      {
        accessor: 'name',
        width: 400,
        sortable: true,
      },
      {
        accessor: 'milestone',
        width: 100,
        sortable: true,
        render: (record) =>
          record?.tenderMilestones
            ?.filter((milestone) => milestone.isCurrent)?.[0]
            ?.milestoneTxt?.replace(/([a-z])([A-Z])/g, '$1 $2') ?? '',
      },

      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              const currentStage = record?.tenderMilestones?.filter(
                (milestone) => milestone.isCurrent,
              )?.[0]?.milestoneTxt;
              if (currentStage === 'TechnicalCompliance')
                router.push(`/evaluation/${tenderId}/${record.id}`);
              else if (currentStage === 'TechnicalQualification')
                router.push(
                  `/evaluation/${tenderId}/${record.id}/qualification`,
                );
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 10,
      },
    ],
  };
  return (
    <>
      <TenderOverView basePath="/evaluation" />
      <Section title="Lots List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={lots?.items ?? []}
          total={lots?.total ?? 0}
          onRequestChange={(request) => {
            getLots({
              tenderId,
              collectionQuery: { ...request, includes: ['tenderMilestones'] },
            });
          }}
        />
      </Section>
    </>
  );
}
