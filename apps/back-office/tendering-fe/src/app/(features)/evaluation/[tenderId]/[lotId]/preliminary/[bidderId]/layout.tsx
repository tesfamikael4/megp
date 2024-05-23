'use client';

import { BidderOverView } from '@/app/(features)/evaluation/_components/bidder-overview';
import { Requirements } from '@/app/(features)/evaluation/_components/requirements';
import { Box, Flex } from '@mantine/core';
import { useParams } from 'next/navigation';

export default function BiderDetail({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenderId, lotId } = useParams();
  return (
    <>
      <BidderOverView
        basePath={`/evaluation/${tenderId}/${lotId}/preliminary`}
        milestone="technicalCompliance"
      />
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-1/4">
          <Requirements milestone="technicalCompliance" />
        </Box>
        <Box className="w-3/4">{children}</Box>
      </Flex>
    </>
  );
}
