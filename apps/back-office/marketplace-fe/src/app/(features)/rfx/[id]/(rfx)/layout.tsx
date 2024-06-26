import React, { ReactNode } from 'react';
import RFXTabs from '../../_components/rfx-tabs/rfx-tab.layout';
import { StatusProvider } from '@/contexts/rfx-status.context';

export default function RFXTabLayout({ children }: { children: ReactNode }) {
  return (
    <StatusProvider>
      <RFXTabs>{children}</RFXTabs>
    </StatusProvider>
  );
}
