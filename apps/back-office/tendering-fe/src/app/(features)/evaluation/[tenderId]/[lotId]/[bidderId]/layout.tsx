'use client';

import { Box, Flex } from '@mantine/core';
import { Checklist } from './_components/checklist';
import { useParams } from 'next/navigation';
import { BidderOverView } from '../../../_components/bidder-overview';

export default function BiderDetail({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenderId, lotId } = useParams();
  return (
    <>
      <BidderOverView basePath={`/evaluation/${tenderId}/${lotId}`} />
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-1/4">
          <Checklist />
        </Box>
        <Box className="w-3/4">{children}</Box>
      </Flex>
    </>
  );
}
