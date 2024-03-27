import Protected from '@/app/(features)/protected';
import { Flex } from '@mantine/core';
import React, { useState } from 'react';
import Sidebar from './_components/sidebar/sidebar';
import styles from './financial-offer.module.scss';
import { useSearchParams } from 'next/navigation';
import ItemList from './_components/forms/items';
export default function FinancialOfferPage() {
  const [isSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  return (
    <Protected>
      <Flex>
        <nav data-open={isSidebarOpen} className={styles.nav}>
          <Sidebar />
        </nav>
        <main className={styles.main}>
          {searchParams.get('form') === 'financial-offer' && <ItemList />}
        </main>
      </Flex>
    </Protected>
  );
}
