import React from 'react';
import RfxDetailTabs from '../_components/rfx-tab.layout';
import { Providers } from '@/store/provider';
import Protected from '@/app/(features)/protected';

export default function RFXDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <Providers>
        <RfxDetailTabs>{children}</RfxDetailTabs>
      </Providers>
    </Protected>
  );
}
