'use client';
import styles from './page.module.scss';
import { clearToken } from '@/app/auth/clearToken';
import { useRouter } from 'next/navigation';
import { doesTokenExist } from '@/app/auth/checkToken';
import Link from 'next/link';
import { useLazyGetUserInfoQuery } from '@/store/api/auth/auth.api';
import { useEffect, useState } from 'react';
import { Button, LoadingOverlay, Menu } from '@mantine/core';
import { IconCaretDown, IconLogout, IconUserCircle } from '@tabler/icons-react';

export const NavActions = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>();
  const [
    getUserInfo,
    { data, isLoading: userInfoLoading, isSuccess: userInfoLoaded },
  ] = useLazyGetUserInfoQuery();

  useEffect(() => {
    const fetchData = async () => {
      if (doesTokenExist()) {
        // Call getUserInfo and wait for the promise to resolve
        const userInfo = await getUserInfo({});

        // Check if userInfo is loaded
        if (userInfoLoaded) {
          setUserInfo(userInfo.data);
        }
      }
    };

    fetchData();
  }, [getUserInfo, userInfoLoaded]);
  const userName = userInfo && userInfo.fullName;

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
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <div className="flex cursor-pointer">
              {userInfoLoading && <LoadingOverlay />}Hi, {userName}
              <IconCaretDown />
            </div>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconUserCircle />}
              onClick={() => router.push('/my/my-profile')}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              leftSection={<IconLogout />}
              onClick={() => {
                clearToken();
                router.refresh();
              }}
            >
              Log out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
};
