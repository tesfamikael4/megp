import React, { ReactNode } from 'react';
import RFXTabs from '../../_components/rfx-tabs/rfx-tab.layout';

export default function RFXTabLayout({ children }: { children: ReactNode }) {
  return <RFXTabs>{children}</RFXTabs>;
}
