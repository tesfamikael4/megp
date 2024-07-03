'use client';

import { ActionIcon } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useLazyGetFinancialLotsQuery } from '@/store/api/tendering/tender-opening.api';

export default function FinancialOpening() {
  const router = useRouter();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    columns: [
      {
        accessor: 'name',
        width: 400,
        sortable: true,
      },
      {
        accessor: 'status',
        width: 50,
        sortable: true,
      },

      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/financial-opening/${record.tenderId}/${record.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 10,
      },
    ],
  };
  const [getLots, { data: lots }] = useLazyGetFinancialLotsQuery();

  return (
    <>
      <Section title="Lots List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={lots?.items ?? []}
          total={lots?.total ?? 0}
          onRequestChange={(request) => {
            getLots(request);
          }}
        />
      </Section>
    </>
  );
}
