'use client';
import { useLazyGetOpeningByTenderIdQuery } from '@/store/api/tendering/tender-opening.api';
import { Box, LoadingOverlay } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Opening() {
  const { tenderId } = useParams();
  const router = useRouter();
  const [getOpening, { data }] = useLazyGetOpeningByTenderIdQuery();

  useEffect(() => {
    getOpening(tenderId as string);
  }, []);

  useEffect(() => {
    if (data && data.total >= 1) {
      router.push(`/opening/${tenderId}/lots`);
    } else if (data && data.total == 0) {
      router.push(`/opening/${tenderId}/bidders`);
    }
  }, [data, router, tenderId]);
  return (
    <Box pos="relative" className="h-[90vh] w-full">
      <LoadingOverlay visible={true} />
    </Box>
  );
}
