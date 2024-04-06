'use client';
import { PrepareBidProvider } from '@/contexts/prepare-bid.context';
import React, { useEffect, useState } from 'react';
import Protected from './protected';

function PrepareBid({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState<{
    password: string;
    tenderId: string;
  } | null>(null);
  useEffect(() => {
    if (window) {
      setPassword(JSON.parse(window.sessionStorage.getItem('password') ?? ''));
    }
  }, []);
  return (
    <Protected>
      <PrepareBidProvider value={password}>{children}</PrepareBidProvider>
    </Protected>
  );
}

export default PrepareBid;
