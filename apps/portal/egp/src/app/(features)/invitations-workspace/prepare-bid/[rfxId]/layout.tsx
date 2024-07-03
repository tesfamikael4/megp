import React from 'react';
import RfxDetailTabs from '../_components/rfx-tab.layout';
import { Providers } from '@/store/provider';
import Protected from '@/app/(features)/protected';
import { StatusProvider } from '../../context/rfx-detail.context';

export default function RFXDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <Providers>
        <RfxDetailTabs>
          <StatusProvider>{children}</StatusProvider>
        </RfxDetailTabs>
      </Providers>
    </Protected>
  );
}
