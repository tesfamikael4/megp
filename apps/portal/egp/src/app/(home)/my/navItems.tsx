'use client';
import { usePathname } from 'next/navigation';

export const Profile = () => {
  const pathname = usePathname();
  return (
    <div
      className={`border-b-2 p-4 ${
        pathname === '/my/my-profile' && 'bg-primary-700 text-white rounded-md'
      }`}
    >
      Profile
    </div>
  );
};

export const Security = () => {
  const pathname = usePathname();
  return (
    <div
      className={`border-b-2 p-4  ${
        pathname === '/my/security' && 'bg-primary-700 text-white rounded-md'
      }`}
    >
      Security
    </div>
  );
};
