import { Section } from '@megp/core-fe';
import React from 'react';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { useLazyListByIdQuery } from '@/app/(features)/preparation/_api/tender/procurement-technical-team.api';
import { useParams } from 'next/navigation';
import { Badge } from '@mantine/core';

export default function TechnicalTeams() {
  const [trigger, { data, isLoading }] = useLazyListByIdQuery();
  const { id } = useParams();
  const config = {
    columns: [
      {
        accessor: 'userName',
        title: 'Full Name',
        width: 200,
        sortable: true,
      },
      {
        accessor: 'isTeamLead',
        title: 'Team leader',
        width: 100,
        sortable: true,
        render: ({ isTeamLead }) => (
          <Badge color="gray" variant="outline" size="xs">
            {isTeamLead ? 'Yes' : 'No'}
          </Badge>
        ),
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isLoading,
    primaryColumn: 'firstName',
  };
  const onRequestChange = (request: any) => {
    trigger({ id: id.toString(), collectionQuery: request });
  };

  return (
    <Section
      title="Procurement Technical Team"
      collapsible={true}
      defaultCollapsed={true}
    >
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}
