'use client';
import { PrepareBidProvider } from '@/contexts/prepare-bid.context';
import React, { useEffect, useState } from 'react';
import Protected from './protected';
import { useParams, useRouter } from 'next/navigation';

function PrepareBid({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { tenderId } = useParams();
  const [password, setPassword] = useState<{
    password: string;
    tenderId: string;
  } | null>(null);
  useEffect(() => {
    if (window && sessionStorage.getItem('password')) {
      if (window.sessionStorage.getItem('password')) {
        setPassword(
          JSON.parse(window.sessionStorage.getItem('password') ?? ''),
        );
      } else {
        router.push(`/tender-workspace/${tenderId}/check-password`);
      }
    }
  }, []);
  return (
    <Protected>
      <PrepareBidProvider value={password}>{children}</PrepareBidProvider>
    </Protected>
  );
}

export default PrepareBid;
