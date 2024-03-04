import { Section } from '@megp/core-fe';
import React from 'react';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { useLazyListQuery } from '@/app/(features)/preparation/_api/tender/procurement-technical-team.api';

export default function TechnicalTeams() {
  const [trigger, { data, isLoading }] = useLazyListQuery();

  const config = {
    columns: [
      {
        accessor: 'firstName',
        title: 'First Name',
        width: 200,
        sortable: true,
      },
      { accessor: 'lastName', title: 'Last Name', width: 200, sortable: true },
      {
        accessor: 'isTeamLead',
        title: 'Team leader',
        width: 100,
        sortable: true,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isLoading,
    primaryColumn: 'firstName',
  };
  const onRequestChange = (request: any) => {
    trigger(request);
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
