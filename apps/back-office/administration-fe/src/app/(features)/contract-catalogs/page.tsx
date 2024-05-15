'use client';
import { CollectionQuery } from '@megp/entity';
import { useRouter } from 'next/navigation';
import { ExpandableTable, Section } from '@megp/core-fe';
import { useLazyListQuery } from './_api/contract.api';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { ActionIcon, Button } from '@mantine/core';

export default function ContractCatalogList() {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config = {
    columns: [
      {
        accessor: 'contractReferenceNumber',
        title: 'Reference',
        width: 150,
        sortable: true,
      },
      {
        accessor: 'contractTitle',
        width: 300,
        sortable: true,
      },
      { accessor: 'description', title: 'Description', sortable: true },
      {
        accessor: 'id',
        title: '',
        render: (catalog) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              route.push(`/contract-catalogs/${catalog.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <>
      <Section
        title="Contract Catalogs"
        action={
          <Button onClick={() => route.push('contract-catalogs/new')}>
            <IconPlus size={14} /> Add
          </Button>
        }
        collapsible={false}
      >
        <ExpandableTable
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Section>
    </>
  );
}
