'use client';
import { Section } from '@megp/core-fe';
import { useEffect, useState } from 'react';
import { useLazyGetMatchedProductsQuery } from '../../../_api/items.api';
import { useParams } from 'next/navigation';
import InvitationDetail from '../../_components/price-schedule/invitation-detail.component';
import { Group, LoadingOverlay, Pagination, Stack } from '@mantine/core';

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
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(invitationsList?.total ?? 0, perPage);

  const { rfxId } = useParams();

  useEffect(() => {
    const from = (page - 1) * perPage;
    getInvitations({
      id: rfxId?.toString() ?? '',
      collectionQuery: { skip: from, take: perPage },
    });
  }, []);

  return (
    <Section title="Financial Offer" collapsible={false}>
      <LoadingOverlay visible={isGettingInvitations} />
      <Stack className="gap-6">
        {invitationsList?.items?.map((product, index) => (
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
