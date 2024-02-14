'use client';

import { PageLayout } from '@megp/core-fe';
import React from 'react';

export default function InitiationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <>{children}</>
    </PageLayout>
  );
}
