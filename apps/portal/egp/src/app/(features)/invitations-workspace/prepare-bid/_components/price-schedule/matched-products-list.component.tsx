'use client';

import { ActionIcon, Text } from '@mantine/core';
import { ExpandableTable } from '@megp/core-fe';
import InvitationDetail from './invitation-detail.component';
import { CollectionQuery } from '@megp/entity';
import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { useLazyGetMatchedProductsQuery } from '../../../_api/items.api';

export default function Invitation({ itemId }: { itemId: string }) {
  const [skip, setSkip] = useState(0);
  const [
    getInvitations,
    { data: invitationsList, isLoading: isGettingInvitations },
  ] = useLazyGetMatchedProductsQuery();

  const invitationsConfig = {
    columns: [
      {
        accessor: 'product',
        title: 'No',
        render: (_, index) => <>{skip + index + 1}</>,
      },
      {
        accessor: 'product',
        title: 'Product',
        render: (value) => (
          <>
            <Text lineClamp={1}>
              {Object.entries(value?.catalogueSpecificationValues || {})
                .filter(([key]) => key !== 'url')
                .map(
                  ([key, value]) =>
                    `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} `,
                )
                .join(', ')}
            </Text>
          </>
        ),
      },
      {
        accessor: 'product',
        title: '',
        render: (value) => (
          <>
            <ActionIcon variant="outline">
              <IconChevronDown />
            </ActionIcon>
          </>
        ),
      },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'product',
    isFetching: isGettingInvitations,
    expandedRowContent: (product) => {
      return <InvitationDetail product={product} />;
    },
  };

  const onRequestChange = (request: CollectionQuery) => {
    setSkip(request?.skip ?? 0);
    getInvitations({
      id: itemId?.toString() ?? '',
      collectionQuery: request,
    });
  };

  return (
    <ExpandableTable
      config={invitationsConfig}
      data={invitationsList?.items ?? []}
      total={invitationsList?.total}
      onRequestChange={onRequestChange}
    />
  );
}
