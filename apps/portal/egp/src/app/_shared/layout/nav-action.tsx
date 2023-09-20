'use client';
import styles from './page.module.scss';
import { clearToken } from '@/app/auth/clearToken';
import { useRouter } from 'next/navigation';
import { doesTokenExist } from '@/app/auth/checkToken';
import Link from 'next/link';

export const NavActions = () => {
  const router = useRouter();
  return (
    <>
      {doesTokenExist() == false && (
        <ul className={styles.navActionsLogout}>
          <li className={styles.navLinkLogout}>
            <Link href="/auth/login" passHref>
              Sign In
            </Link>
          </li>
          <li className={styles.navLinkLogout}>
            <Link href="/auth/signup" passHref>
              Create Account
            </Link>
          </li>
        </ul>
      )}
      {doesTokenExist() == true && (
        <ul className={styles.navActionsLogout}>
          <li
            className={styles.navLinkLogout}
            onClick={() => {
              clearToken();
              router.refresh();
            }}
          >
            Logout
          </li>
        </ul>
      )}
    </>
  );
};
