import { Suspense } from 'react';
import SetPassWord from '../(user)/_components/set-password';

export default function Form() {
  return (
    <Suspense>
      <SetPassWord mode="setPassword" />
    </Suspense>
  );
}
