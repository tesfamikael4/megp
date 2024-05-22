'use client';

import { Box, Container, LoadingOverlay } from '@mantine/core';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  CollectionQuery,
  EntityConfig,
  EntityLayout,
  EntityList,
} from '@megp/entity';
import { addSpacesToCamelCase } from '../../vendor/(workspace)/registration/_components/review/addSpaceToCamelCase';
import { useGetVendorsQuery, useLazyGetVendorsQuery } from '../../_api/reports';
import { usePathname, useRouter } from 'next/navigation';

const Entity = ({
  children,
  list,
  isLoading,
  onRequestChange,
}: {
  children: React.ReactElement;
  list: { items: any[]; total: number };
  isLoading: boolean;
  onRequestChange: (query: CollectionQuery) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const config: EntityConfig<unknown> = useMemo(() => {
    return {
      basePath: `/vendors`,
      mode: 'list',
      entity: 'vendors',
      primaryKey: 'id',
      primaryContent: 'name',
      searchable: true,
      title: 'Vendors List',
      hasAdd: false,
      hasDetail: true,
      pagination: true,
      sortable: true,
      onDetail: (selected: any) => {
        router.push(`/vendors/${selected.id}`);
      },

      columns: [
        {
          id: 'name',
          header: 'Business/Company Name',
          accessorKey: 'name',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
        {
          id: 'businessType',
          header: 'Form of Business',
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
    };
  }, [router]);
  const mode = pathname == '/vendors' ? 'list' : 'detail';

  if (isLoading) <LoadingOverlay />;
  else if (!list) <Box>No Data Message</Box>;
  else
    return (
      <Box>
        <EntityLayout
          config={config}
          data={list.items ?? []}
          hasTree={Boolean(false)}
          isLoading={isLoading}
          mode={mode}
          total={list.total}
          detail={children}
          onRequestChange={onRequestChange}
        />
      </Box>
    );
};

export default Entity;
