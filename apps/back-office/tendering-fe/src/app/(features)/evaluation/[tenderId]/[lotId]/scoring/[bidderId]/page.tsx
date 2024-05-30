'use client';

import { useLazyGetScoringRequirementsByLotIdQuery } from '@/store/api/tendering/technical-scoring.api';
import { Box, Loader } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BiderDetail() {
  const router = useRouter();
  const [getRequirements, { data: requirementData, isSuccess }] =
    useLazyGetScoringRequirementsByLotIdQuery();
  const { tenderId, lotId, bidderId } = useParams();

  useEffect(() => {
    getRequirements({ lotId: lotId as string, bidderId: bidderId as string });
  }, []);

  const getLeafId = (data) => {
    let leafId = data.id;
    if (data?.children?.length > 0) {
      leafId = getLeafId(data?.children[0]);
    }
    return leafId;
  };

  useEffect(() => {
    if (requirementData) {
      const reqId = getLeafId(requirementData);
      router.push(
        `/evaluation/${tenderId}/${lotId}/scoring/${bidderId}/${reqId}`,
      );
    }
  }, [bidderId, requirementData, isSuccess, lotId, router, tenderId]);
  return (
    <Box className="flex justify-center items-center h-full">
      <Loader />
    </Box>
  );
}
