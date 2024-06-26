import { StatusProvider } from '@/contexts/rfx-status.context';
import React from 'react';

export default function ItemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StatusProvider>{children}</StatusProvider>;
}
