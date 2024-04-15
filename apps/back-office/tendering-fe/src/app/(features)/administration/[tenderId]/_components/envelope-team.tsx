'use client';

import {
  useLazyGetLotsByTenderIdQuery,
  useLazyGetTenderDetailQuery,
} from '@/store/api/tendering/tendering.api';
import { Box } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Members } from './members';

export const EnvelopTeam = () => {
  const { tenderId } = useParams();
  const config: ExpandableTableConfig = {
    minHeight: 100,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTeam lot={record} />,
    columns: [
      {
        accessor: 'name',
        title: 'Lot Name',
        sortable: true,
      },
    ],
  };
  const [getLots, { data: lots }] = useLazyGetLotsByTenderIdQuery();

  useEffect(() => {
    getLots({ tenderId });
  }, []);
  return <ExpandableTable config={config} data={lots?.items ?? []} />;
};

const DetailTeam = ({ lot }: any) => {
  const { tenderId } = useParams();
  const [getTender, { data }] = useLazyGetTenderDetailQuery();
  const config: ExpandableTableConfig = {
    columns: [{ accessor: 'name', title: 'Team Type' }],
    minHeight: 100,
    isExpandable: true,
    expandedRowContent: (record, collapse) => (
      <Members
        team={record}
        collapse={collapse}
        envelopeType={data?.bdsSubmission?.envelopType ?? ''}
        lotId={lot.id}
      />
    ),
  };
  const teamType =
    data?.bdsSubmission?.envelopType === 'single envelop'
      ? [
          {
            id: 1,
            name: 'Financial Evaluation Team',
            teamType: 'FINANCIAL_EVALUATOR',
          },
        ]
      : [
          {
            id: 1,
            name: 'Financial Evaluation Team',
            teamType: 'FINANCIAL_EVALUATOR',
          },
          {
            id: 2,
            name: 'Technical Evaluation Team',
            teamType: 'TECHNICAL_EVALUATOR',
          },
        ];

  useEffect(() => {
    getTender(tenderId as string);
  }, [tenderId]);
  return (
    <Box className="p-3">
      <ExpandableTable config={config} data={teamType} />
    </Box>
  );
};
