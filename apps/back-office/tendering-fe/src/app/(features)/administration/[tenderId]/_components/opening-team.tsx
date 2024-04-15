'use client';
import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';
import { Members } from './members';
import { useLazyGetTenderDetailQuery } from '@/store/api/tendering/tendering.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export const OpeningTeam = () => {
  const config: ExpandableTableConfig = {
    minHeight: 100,
    isExpandable: true,
    expandedRowContent: (record, collapse) => (
      <Members
        team={record}
        collapse={collapse}
        envelopeType={data?.bdsSubmission?.envelopType ?? ''}
      />
    ),
    columns: [
      {
        accessor: 'name',
        title: 'Team Type',
      },
    ],
  };
  const { tenderId } = useParams();
  const [getTender, { data }] = useLazyGetTenderDetailQuery();
  const teamType =
    data?.bdsSubmission?.envelopType === 'single envelop'
      ? [
          {
            id: 1,
            name: 'Financial Opening Team',
            teamType: 'FINANCIAL_OPENER',
          },
        ]
      : [
          {
            id: 1,
            name: 'Financial Opening Team',
            teamType: 'FINANCIAL_OPENER',
          },
          {
            id: 2,
            name: 'Technical Opening Team',
            teamType: 'TECHNICAL_OPENER',
          },
        ];

  useEffect(() => {
    getTender(tenderId as string);
  }, [tenderId]);

  return (
    <>
      <ExpandableTable data={teamType} config={config} />
    </>
  );
};
