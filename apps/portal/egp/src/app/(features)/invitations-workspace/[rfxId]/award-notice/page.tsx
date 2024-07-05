'use client';
import {
  Box,
  Flex,
  Group,
  LoadingOverlay,
  Pagination,
  Stack,
} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useRfxDetailQuery } from '@/app/(features)/my-workspace/_api/invitation-registration.api';
import { useParams, useRouter } from 'next/navigation';
import { Section } from '@megp/core-fe';
import InvitationDetail from '../../prepare-bid/_components/price-schedule/invitation-detail.component';
import {
  useLazyGetMatchedProductsQuery,
  useLazyGetMyAwardedItemsQuery,
} from '../../_api/items.api';
import EmptyPlaceholder from '@/app/(features)/my-workspace/_components/empty-placeholder';
import EmptyDataPlaceholder from '@/app/(features)/_components/empty-data-placeholder';
import AwardedItemDetail from './_components/awarded-item-detail.component';

const perPage = 5;
function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export default function AwardNotice() {
  const [getAwardedItems, { data: awardedItems, isLoading: isGettingItems }] =
    useLazyGetMyAwardedItemsQuery();

  const { rfxId } = useParams();
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(awardedItems?.total ?? 0, perPage);
  const { data: selected, isLoading } = useRfxDetailQuery(rfxId?.toString());

  const router = useRouter();

  useEffect(() => {
    const from = (page - 1) * perPage;
    getAwardedItems({
      rfxId: rfxId?.toString() ?? '',
      collectionQuery: { skip: from, take: perPage },
    });
  }, [page]);

  return (
    <Stack className="p-4">
      <Stack>
        <div className="pt-10  text-black font-bold text-2xl flex justify-between">
          <Flex className="items-center gap-2">
            <Box>{selected?.name}</Box>
          </Flex>
        </div>
        {awardedItems?.items?.length > 0 ? (
          <Section title="Items" collapsible={false}>
            <LoadingOverlay visible={isGettingItems} />
            <Stack className="gap-6">
              {awardedItems?.items?.map((product, index) => (
                <AwardedItemDetail key={index} item={product} />
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
        ) : (
          <EmptyDataPlaceholder />
        )}
      </Stack>
    </Stack>
  );
}
