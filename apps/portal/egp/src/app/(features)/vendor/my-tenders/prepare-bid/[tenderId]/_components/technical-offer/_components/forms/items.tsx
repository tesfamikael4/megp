'use client';
import { ExpandableTable, Section } from '@megp/core-fe';
import { LoadingOverlay, ActionIcon, Button } from '@mantine/core';
import { IconChevronRight, IconDeviceFloppy } from '@tabler/icons-react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CollectionQuery } from '@megp/entity';
import { useLazyItemsQuery } from '@/app/(features)/vendor/_api/item.api';
import TechnicalRequirement from './technical-requirement/technical-requirement';
import { SorType } from '@/models/tender/lot/item/technical-requirement.model';

export default function ItemList() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [trigger, { data, isFetching }] = useLazyItemsQuery();
  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 300 },
      { accessor: 'description', title: 'Description', width: 150 },
      { accessor: 'quantity', title: 'Quantity', width: 150 },
      { accessor: 'unitOfMeasure', title: 'Unit Of Measure', width: 150 },
      {
        accessor: 'procurementCategory',
        title: 'Procurement Category',
        width: 150,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
    expandedRowContent: (qualification) => {
      return (
        <>
          <div className="my-4">
            <TechnicalRequirement
              item={qualification}
              type={SorType.SPECIFICATION}
            />
          </div>
          <div className="my-4">
            <TechnicalRequirement
              item={qualification}
              type={SorType.PERSONAL}
            />
          </div>

          <div className="my-4">
            <TechnicalRequirement
              item={qualification}
              type={SorType.DELIVERY}
            />
          </div>

          <div className="my-4">
            <TechnicalRequirement
              item={qualification}
              type={SorType.PACKAGING}
            />
          </div>

          <div className="my-4">
            <TechnicalRequirement
              item={qualification}
              type={SorType.WARRANTY}
            />
          </div>
          <div className="my-4">
            <TechnicalRequirement
              item={qualification}
              type={SorType.INCIDENTAL}
            />
          </div>
        </>
      );
    },
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ lotId: searchParams.get('lot') ?? '', collectionQuery: request });
  };

  return (
    <Section
      title="Technical Offer"
      collapsible={false}
      defaultCollapsed={false}
      action={
        <Button>
          <IconDeviceFloppy size={14} /> Save Changes
        </Button>
      }
    >
      <LoadingOverlay
        visible={isFetching}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}
