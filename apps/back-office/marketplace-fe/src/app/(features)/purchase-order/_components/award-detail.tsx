import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';

const AwardDetail = () => {
  const router = useRouter();
  return (
    <div>
      AwardDetail
      <Button onClick={() => router.push(`/purchase-order/new`)}>
        Create Purchase Order
      </Button>
    </div>
  );
};

export default AwardDetail;
