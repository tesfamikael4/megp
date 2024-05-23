import React from 'react';
import RfxDetailTabs from '../_components/rfx-tab.layout';
import { Providers } from '@/store/provider';

export default function RFXDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <RfxDetailTabs>{children}</RfxDetailTabs>
    </Providers>
  );
}
