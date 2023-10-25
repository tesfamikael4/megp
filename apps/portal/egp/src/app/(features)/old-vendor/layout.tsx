'use client';
import { Title } from '@mantine/core';
import { Button } from '@mantine/core';
import { redirect, usePathname } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Sidebar } from './_components/sidebar/sidebar';
import { sidebarLinks } from './_components/config';
import { doesTokenExist } from '@/app/auth/checkToken';
interface Props {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: Props) {
  const useDisplayNameFinder = (navLinks: any) => {
    const path = usePathname();
    for (const navItem of navLinks) {
      if (navItem.children) {
        for (const childItem of navItem.children) {
          if (
            childItem.link &&
            childItem.link.split('/')[3] === path.split('/')[3]
          ) {
            return childItem.displayName;
          }

          if (childItem.links) {
            for (const subItem of childItem.links) {
              if (
                subItem.link &&
                subItem.link.split('/')[3] === path.split('/')[3]
              ) {
                return subItem.displayName;
              }
            }
          }
        }
      }
    }
    return ''; // Return null if the link is not found.
  };
  const auth = process.env.NEXT_PUBLIC_UI_AUTH || 'true';
  useEffect(() => {
    if (!doesTokenExist()) {
      auth !== 'false' && redirect('/auth/login');
    }
    return () => {};
  }, [auth]);
  const [isSidebarOpen, setCollapse] = useState(false);
  function toggleSidebar() {
    setCollapse((prev) => !prev);
  }

  return (
    <div className="flex">
      <nav
        className={`w-64 min-h-screen transform-gpu transition-transform   ${
          isSidebarOpen ? 'block md:hidden ' : 'hidden md:block'
        } border border-r `}
      >
        <Sidebar data={sidebarLinks} isCollapse={!isSidebarOpen} />
      </nav>

      <main className={`flex-grow border border-r w-[72.8125rem]`}>
        <header className="flex items-center border-b p-4 w-full">
          <Title order={3} size="calc(1rem * var(--mantine-scale))">
            {useDisplayNameFinder(sidebarLinks)}
          </Title>
        </header>
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
