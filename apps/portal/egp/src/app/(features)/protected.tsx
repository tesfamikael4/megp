'use client';
import React, { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '@megp/auth';
import { useIsMounted } from '@/shared/hooks/useIsMounted';
import { LoadingOverlay } from '@mantine/core';

export default function Protected({ children }: { children: React.ReactNode }) {
  const mounted = useIsMounted();
  const { isAuthenticated } = useAuth();

  if (mounted) {
    if (isAuthenticated === false) {
      redirect('/auth/login');
    } else {
      return <>{children}</>;
    }
  } else {
    return (
      <div className="min-h-screen relative">
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          loaderProps={{ type: 'bars' }}
        />
      </div>
    );
  }
}
