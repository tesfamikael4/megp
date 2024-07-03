'use client';
import { Section } from '@megp/core-fe';
import { useContext, useEffect, useState } from 'react';
import {
  useLazyGetMatchedProductsQuery,
  useLazyGetRfxItemWithSpecQuery,
} from '../../../_api/items.api';
import { useParams } from 'next/navigation';
import InvitationDetail from '../../_components/price-schedule/invitation-detail.component';
import { Group, LoadingOverlay, Pagination, Stack } from '@mantine/core';
import { StatusContext } from '../../../context/rfx-detail.context';
import { useLazyGetRfxItemsQuery } from '@/app/(features)/procurement-notice/_api/rfx.api';

const perPage = 5;
function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export default function PriceSchedulePage() {
  const [
    getInvitations,
    { data: invitationsList, isLoading: isGettingInvitations },
  ] = useLazyGetMatchedProductsQuery();
  const [getItems, { data: itemsList, isLoading: isGettingItems }] =
    useLazyGetRfxItemWithSpecQuery();
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(invitationsList?.total ?? 0, perPage);

  const { rfx } = useContext(StatusContext);

  const { rfxId } = useParams();

  useEffect(() => {
    const from = (page - 1) * perPage;
    if (!rfx?.isOpen) {
      getItems({
        rfxId: rfxId?.toString() ?? '',
        collectionQuery: { skip: from, take: perPage },
      });
    } else {
      getInvitations({
        id: rfxId?.toString() ?? '',
        collectionQuery: { skip: from, take: perPage },
      });
    }
  }, [rfx?.isOpen, rfxId, page]);

  return (
    <Section title="Financial Offer" collapsible={false}>
      <LoadingOverlay visible={isGettingInvitations} />
      <Stack className="gap-6">
        {!rfx?.isOpen &&
          invitationsList?.items?.map((product, index) => (
            <InvitationDetail key={index} product={product} />
          ))}
        {rfx?.isOpen &&
          itemsList?.items?.map((product, index) => (
            <InvitationDetail key={index} product={product} />
          ))}
        <Group className="mt-2" justify="end">
          <Pagination
            onChange={setPage}
            size="sm"
            total={totalPages}
            value={page}
            withEdges
          />
        </Group>
      </Stack>
    </Section>
  );
}
