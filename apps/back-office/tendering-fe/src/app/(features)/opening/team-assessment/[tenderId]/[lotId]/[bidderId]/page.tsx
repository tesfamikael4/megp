'use client';
import { useLazyGetBidOpeningChecklistByLotIdQuery } from '@/store/api/tendering/tender-opening.api';
import { Box, Loader } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BiderDetail() {
  const router = useRouter();
  const [getChecklists, { data: checklistData, isSuccess }] =
    useLazyGetBidOpeningChecklistByLotIdQuery();
  const { tenderId, lotId, bidderId } = useParams();

  useEffect(() => {
    getChecklists({ lotId: lotId as string, bidderId: bidderId as string });
  }, []);

  useEffect(() => {
    logger.log({ checklistData });
    if (checklistData && checklistData?.length > 0) {
      router.push(
        `/opening/team-assessment/${tenderId}/${lotId}/${bidderId}/${checklistData[0].id}`,
      );
    }
  }, [bidderId, checklistData, isSuccess, lotId, router, tenderId]);
  return (
    <Box className="flex justify-center items-center h-full">
      <Loader />
    </Box>
  );
}
