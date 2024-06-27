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
import { useLazyGetMatchedProductsQuery } from '../../_api/items.api';

const perPage = 5;
function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export default function AwardNotice() {
  const [
    getInvitations,
    { data: invitationsList, isLoading: isGettingInvitations },
  ] = useLazyGetMatchedProductsQuery();
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(invitationsList?.total ?? 0, perPage);
  const { data: selected, isLoading } = useRfxDetailQuery(id?.toString());

  const router = useRouter();

  useEffect(() => {
    const from = (page - 1) * perPage;
    getInvitations({
      id: id?.toString() ?? '',
      collectionQuery: { skip: from, take: perPage },
    });
  }, []);

  return (
    <Stack className="p-4">
      <Stack>
        <div className="pt-10  text-black font-bold text-2xl flex justify-between">
          <Flex className="items-center gap-2">
            <Box>{selected?.name}</Box>
          </Flex>
        </div>
        <Section title="Items" collapsible={false}>
          <LoadingOverlay visible={isGettingInvitations} />
          <Stack className="gap-6">
            {invitationsList?.items?.map((product, index) => (
              <InvitationDetail
                mode={'award'}
                showAction={false}
                key={index}
                product={product}
              />
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
      </Stack>
    </Stack>
  );
}
