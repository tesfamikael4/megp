'use client';

import { useLazyGetPreliminaryRequirementsByLotIdQuery } from '@/store/api/tendering/preliminary-compliance.api';
import { Box, Loader } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BiderDetail() {
  const router = useRouter();
  const [getRequirements, { data: requirementData, isSuccess }] =
    useLazyGetPreliminaryRequirementsByLotIdQuery();
  const { tenderId, lotId, bidderId } = useParams();

  useEffect(() => {
    getRequirements({
      lotId: lotId as string,
      bidderId: bidderId as string,
      team: 'teamLeader',
    });
  }, []);

  useEffect(() => {
    logger.log({ requirementData });
    if (requirementData && requirementData?.length > 0) {
      router.push(
        `/evaluation/team-assessment/${tenderId}/${lotId}/preliminary/${bidderId}/${requirementData[0].id}`,
      );
    }
  }, [bidderId, requirementData, isSuccess, lotId, router, tenderId]);
  return (
    <Box className="flex justify-center items-center h-full">
      <Loader />
    </Box>
  );
}
