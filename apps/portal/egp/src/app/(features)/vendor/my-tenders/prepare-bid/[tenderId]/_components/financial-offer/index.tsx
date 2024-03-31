import Protected from '@/app/(features)/protected';
import { Flex } from '@mantine/core';
import React, { useState } from 'react';
import styles from './financial-offer.module.scss';
import { useSearchParams } from 'next/navigation';
import ItemList from './_components/forms/items';
export default function FinancialOfferPage() {
  const [isSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  return (
    <Protected>
      <ItemList />
    </Protected>
  );
}
