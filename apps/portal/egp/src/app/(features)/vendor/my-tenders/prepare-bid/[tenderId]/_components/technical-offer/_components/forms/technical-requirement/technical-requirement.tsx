'use client';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import {
  SorType,
  TechnicalRequirement,
} from '@/models/tender/lot/item/technical-requirement.model';
import { CollectionQuery } from '@megp/entity';
import { Item } from '@/models/tender/lot/item';
import { useLazyTechnicalRequirementsQuery } from '@/app/(features)/vendor/_api/item.api';
import { Select, Textarea } from '@mantine/core';

export default function TechnicalRequirement({
  item,
  type = SorType.SPECIFICATION,
}: {
  item: Item;
  type?: SorType;
}) {
  const [trigger, { data, isFetching }] = useLazyTechnicalRequirementsQuery();
  const config = {
    columns: [
      { accessor: 'category', title: 'Category', width: 300 },
      {
        accessor: 'requirement',
        title: 'Requirement',
        width: 150,
      },
      {
        accessor: 'Compliance',
        header: 'Action',
        render: (record) => (
          <>
            <Select
              data={['Comply', 'Not Comply']}
              className="w-full"
              withAsterisk
            />
          </>
        ),
        width: 100,
      },
      {
        accessor: 'Offered Specification',
        header: 'Action',
        render: (record) => (
          <>
            <Textarea withAsterisk autosize minRows={2} />
          </>
        ),
        width: 300,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      itemId: item.id,
      collectionQuery: {
        ...request,
        where: [
          [
            {
              column: 'sorType',
              value: type,
              operator: '=',
            },
          ],
        ],
      },
    });
  };

  return (
    <Section
      title={type}
      collapsible={true}
      defaultCollapsed={true}
      className="capitalize"
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
