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
  const { tenderId, lotId, bidderId } = useParams();
  return (
    <>
      <ItemBidderOverView
        basePath={`/evaluation/team-assessment/${tenderId}/${lotId}/responsiveness/bidders/${bidderId}`}
      />
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-1/4">
          <Requirements
            milestone="technicalResponsiveness"
            teamAssessment={true}
          />
        </Box>
        <Box className="w-3/4">{children}</Box>
      </Flex>
    </>
  );
}
