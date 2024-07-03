import { StatusProvider } from '@/contexts/rfx-status.context';
import React from 'react';

export default function EvaluationApprovalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StatusProvider>{children}</StatusProvider>;
}
