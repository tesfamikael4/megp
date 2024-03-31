import Protected from '@/app/(features)/protected';
import { Flex } from '@mantine/core';
import React, { useState } from 'react';
import Sidebar from './_components/sidebar/sidebar';
import styles from './form.module.scss';
import { useSearchParams } from 'next/navigation';
import { IconFolderOpen } from '@tabler/icons-react';
import BidForm from './_components/bid-form';
export default function FormsPage() {
  const [isSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  return (
    <Protected>
      <Flex>
        <nav data-open={isSidebarOpen} className={styles.nav}>
          <Sidebar />
        </nav>
        <main className={styles.main}>
          <>
            {searchParams.get('form') ? (
              <>
                <BidForm bidFormId={searchParams.get('form') ?? ''} />
              </>
            ) : (
              <>
                <div className="w-full bg-white flex flex-col h-96 justify-center items-center">
                  <IconFolderOpen className="w-32 h-16 stroke-1" />
                  <p className="text-base font-semibold">no form selected</p>
                  <p>Please Select a form first</p>
                </div>
              </>
            )}
          </>
        </main>
      </Flex>
    </Protected>
  );
}
