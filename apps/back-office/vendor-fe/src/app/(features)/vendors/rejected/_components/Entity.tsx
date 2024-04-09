'use client';
import { addSpacesToCamelCase } from '@/app/(features)/util/addSpaceToCamelCase';
import { Vendor } from '@/store/api/vendor_request_handler/type';
import { Box } from '@mantine/core';
import { CollectionQuery, EntityConfig, EntityList } from '@megp/entity';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function Entity({
  children,
  list,
  isLoading,
  title,
  onRequestChange,
}: {
  children: React.ReactElement;
  list: { items: any[]; total: number };
  isLoading: boolean;
  title: string;
  onRequestChange: (query: CollectionQuery) => void;
}) {
  const router = useRouter();

  const config: EntityConfig<Partial<Vendor>> = useMemo(() => {
    return {
      basePath: `/vendors`,
      mode: 'list',
      entity:
        title == 'approved'
          ? 'Approved Vendors'
          : title == 'rejected'
            ? 'Rejected Applications'
            : 'Debarred Vendors',
      primaryKey: 'id',
      primaryContent: 'description',
      title:
        title == 'approved'
          ? 'Approved Vendors'
          : title == 'rejected'
            ? 'Rejected Applications'
            : 'Debarred Vendors',
      hasAdd: false,
      onDetail: (selected: Vendor) => {
        const param = new URLSearchParams();
        param.set('type', title);
        router.push(`/vendors/${title}/${selected.id}`);
      },

      columns: [
        {
          id: 'vendor',
          header: 'Company Name',
          accessorKey: 'vendor',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
        {
          id: 'businessType',
          header: 'Business Type ',
          accessorKey: 'businessType',
          meta: {
            widget: 'expand',
          },
          cell: (info) => addSpacesToCamelCase(info.getValue() as string),
        },

        {
          id: 'countryOfRegistration',
          header: 'Country of Registration',
          accessorKey: 'countryOfRegistration',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
      ],
      sortable: true,
      pagination: true,
    };
  }, [router]);

  const mode = 'list';
  return (
    <Box>
      <EntityList
        config={config}
        data={list.items ?? []}
        hasTree={Boolean(false)}
        isLoading={isLoading}
        mode={mode}
        total={list.total}
        onRequestChange={onRequestChange}
      />
    </Box>
  );
}
