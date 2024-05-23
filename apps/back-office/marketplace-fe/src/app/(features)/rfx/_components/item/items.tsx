'use client';

import { ActionIcon, Badge, Box } from '@mantine/core';
import { ExpandableTable } from '@megp/core-fe';
import { useParams, useRouter } from 'next/navigation';
import { CollectionQuery } from '@megp/entity';
import { IconChevronRight } from '@tabler/icons-react';
import { useLazyListByIdQuery } from '../../_api/rfx/items.api';

export function Items({
  layout,
  viewMode,
}: {
  layout?: 'partition';
  viewMode?: 'list' | 'detail';
}) {
  const [listById, { data: itemsList, isLoading }] = useLazyListByIdQuery();

  const { id } = useParams();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'description', title: 'Description' },
      {
        title: 'UoM',
        accessor: 'unitOfMeasure',
        width: 200,
        hidden: viewMode == 'detail',
      },
      {
        accessor: 'quantity',
        width: 100,
        hidden: viewMode == 'detail',
      },
      {
        accessor: 'procurementCategory',
        hidden: viewMode == 'detail',
      },
      {
        accessor: 'status',
        render: (value) => (
          <>
            <Badge
              color={value?.status === 'INVITATION_PREPARED' ? 'green' : 'red'}
              variant="light"
              fw={700}
              radius={'sm'}
            >
              {value?.status == 'INVITATION_PREPARED'
                ? 'Prepared'
                : 'Not Prepared'}
            </Badge>
          </>
        ),
        hidden: viewMode == 'detail',
      },
      {
        accessor: 'Products Matched',
        hidden: viewMode == 'detail',
        render: (value) => <>{value?.invitationCount ?? '-'}</>,
      },
      {
        accessor: 'id',
        title: '',
        render: (item) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (layout == 'partition') {
                router.push(`/rfx/${id}/invitation/${item.id}`);
              } else router.push(`/rfx/${id}/${item.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
  };

  const listConfig = {
    ...config,
    isLoading: isLoading,
    isSearchable: true,
    columns: [...config.columns],
  };

  const onRequestChange = (request: CollectionQuery) => {
    listById({
      id: id?.toString() ?? '',
      collectionQuery: request,
    });
  };

  return (
    <Box className="mt-2">
      <ExpandableTable
        config={listConfig}
        data={itemsList?.items ?? []}
        total={itemsList?.total}
        onRequestChange={onRequestChange}
      />
    </Box>
  );
}
