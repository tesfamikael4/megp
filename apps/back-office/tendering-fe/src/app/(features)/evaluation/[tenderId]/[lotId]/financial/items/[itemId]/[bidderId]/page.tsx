'use client';

import { BidderOverView } from '@/app/(features)/evaluation/_components/bidder-overview';
import { Box } from '@mantine/core';
import { useParams } from 'next/navigation';

export default function BiderDetail() {
  const { tenderId, lotId, itemId } = useParams();
  return (
    <Box className="flex justify-center items-center h-full">
      <BidderOverView
        basePath={`/evaluation/${tenderId}/${lotId}/financial/items/${itemId}`}
        milestone="technicalResponsiveness"
      />
    </Box>
  );
}
