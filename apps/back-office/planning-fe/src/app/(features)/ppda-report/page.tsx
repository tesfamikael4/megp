'use client';

import { useLazyGetOrganizationsQuery } from '@/store/api/iam/iam.api';
import { ActionIcon } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function PPDAReport() {
  const [getOrganizations, { data: organizations }] =
    useLazyGetOrganizationsQuery();
  const router = useRouter();

  const config: ExpandableTableConfig = {
    isSearchable: true,
    primaryColumn: 'name',
    columns: [
      {
        accessor: 'name',
        title: 'Organization Name',
        sortable: true,
        width: 200,
      },
      {
        accessor: 'description',
        sortable: true,
        width: 400,
      },
      {
        accessor: 'action',
        title: '',
        width: 30,
        render: (record) => {
          return (
            <ActionIcon
              onClick={() => {
                router.push(`/ppda-report/${record.id}`);
              }}
              variant="subtle"
            >
              <IconChevronRight size={14} />
            </ActionIcon>
          );
        },
      },
    ],
  };
  return (
    <Section title="Organizations" collapsible={false}>
      <ExpandableTable
        data={organizations?.items ?? []}
        total={organizations?.total ?? 0}
        config={config}
        onRequestChange={(request) => {
          getOrganizations(request);
        }}
      />
    </Section>
  );
}
