'use client';

import { Button } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
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
