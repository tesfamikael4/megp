'use client';
import { useLazyGetCanAssessQuery } from '@/store/api/tendering/bid-price-evaluation.api';
import { Flex, Loader } from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Financial() {
  const { lotId, tenderId } = useParams();
  const [getCanAssess] = useLazyGetCanAssessQuery();
  const router = useRouter();

  const canAssess = async () => {
    try {
      const res = await getCanAssess(lotId).unwrap();
      if (res.canAssess)
        router.push(`/evaluation/${tenderId}/${lotId}/financial/items`);
      else router.push(`/evaluation/${tenderId}/${lotId}/financial/config`);
    } catch {
      notify('Error', 'Something went wrong please reload your page');
    }
  };

  useEffect(() => {
    canAssess();
  }, []);
  return (
    <>
      <Flex className="h-[90vh] w-full" justify={'center'} align={'center'}>
        <Loader />
      </Flex>
    </>
  );
}
