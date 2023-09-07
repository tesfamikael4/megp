'use client';

import { Button } from '@mantine/core';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
export default function Logout() {
  const router = useRouter();

  const logout = () => {
    deleteCookie('token');

    router.push('/auth');
  };

  return (
    <div>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
