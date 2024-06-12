'use client';

import { Box, Flex } from '@mantine/core';
import { useParams } from 'next/navigation';
import { Requirements } from '@/app/(features)/evaluation/_components/requirements';
import { ItemBidderOverView } from '@/app/(features)/evaluation/_components/item-bidder-overview';

export default function BiderDetail({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenderId, lotId, itemId } = useParams();
  return (
    <>
      <ItemBidderOverView
        basePath={`/evaluation/${tenderId}/${lotId}/responsiveness/${itemId}`}
      />
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-1/4">
          <Requirements milestone="technicalResponsiveness" />
        </Box>
        <Box className="w-3/4">{children}</Box>
      </Flex>
    </>
  );
}
