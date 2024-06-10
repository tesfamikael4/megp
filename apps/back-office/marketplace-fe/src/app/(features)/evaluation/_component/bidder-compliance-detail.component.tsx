'use client';
import { useGetMyResponsesQuery } from '@/store/api/rfx/rfx.api';
import { Badge, Stack } from '@mantine/core';
import { ExpandableTable } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import React from 'react';

export default function BiddderComplianceDetail({ bidder }: { bidder: any }) {
  const { id, assessmentMode } = useParams();
  const { data: myResponses, isLoading: isGettingResponses } =
    useGetMyResponsesQuery({
      rfxId: id.toString(),
      bidderId: bidder?.id.toString(),
      isTeamAssessment: assessmentMode == 'team' ? true : false,
    });

  const config = {
    columns: [
      { accessor: 'documentTitle', title: 'Name' },
      {
        accessor: 'assessment',
        width: 250,
        render: (value) =>
          value?.complied == 1 ? (
            <Badge color="green">Comply</Badge>
          ) : value?.notComplied == 1 ? (
            <Badge color="red">Not Comply</Badge>
          ) : (
            <Badge color="yellow">In progress</Badge>
          ),
      },
    ],
    isExpandable: false,
    isSearchable: false,
    primaryColumn: 'name',
    isLoading: isGettingResponses,
  };

  return (
    <Stack className="p-4">
      <ExpandableTable config={config} data={myResponses ?? []} />
    </Stack>
  );
}
