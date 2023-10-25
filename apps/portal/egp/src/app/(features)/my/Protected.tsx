'use client';
import { doesTokenExist } from '@/app/auth/checkToken';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!doesTokenExist) {
      router.push('/auth/login');
      console.log('Not signed in');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}
