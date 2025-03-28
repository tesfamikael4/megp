'use client';
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
        title == 'approved' ? 'Approved Vendors' : 'Rejected Applications',
      primaryKey: 'id',
      primaryContent: 'description',
      title: '',
      hasAdd: false,
      onDetail: (selected: Vendor) => {
        const param = new URLSearchParams();
        param.set('type', title);
        router.push(`/vendors/${selected.id}`);
      },

      columns: [
        {
          id: 'name',
          header: 'Company Name',
          accessorKey: 'name',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
        {
          id: 'businessType',
          header: 'Service Type ',
          accessorKey: 'businessType',
          meta: {
            widget: 'expand',
          },
        },

        {
          id: 'origin',
          header: 'Country',
          accessorKey: 'origin',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
        {
          id: 'district',
          header: 'District',
          accessorKey: 'district',
          meta: {
            widget: 'expand',
          },
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
