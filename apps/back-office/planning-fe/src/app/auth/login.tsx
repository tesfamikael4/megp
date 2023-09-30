'use client';

import { Button } from '@mantine/core';
import { setCookie } from 'cookies-next';
import { redirect, useRouter } from 'next/navigation';
import { logger } from '@megp/core-fe';
export default function Login() {
  const router = useRouter();

  const login = () => {
    setCookie('token', '123', { secure: true });
    logger.log('Login');
    router.push('/dashboard');
  };

  return (
    <div>
      <Button onClick={login}>Login</Button>
    </div>
  );
}
