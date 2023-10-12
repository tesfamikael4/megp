'use client';
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
  const path = usePathname();
  useEffect(() => {
    if (!doesTokenExist()) {
      redirect('/auth/login');
    }
    return () => {};
  }, []);
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
        <header className="flex items-center justify-between border-b p-4 w-full">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          {path.includes('/egp/vendors/new/') && (
            <Button
              onClick={() =>
                document.getElementById('res-big-form-submit')?.click()
              }
            >
              Submit
            </Button>
          )}
          {/* <button
            className={` px-4 py-2 rounded-md  ${isSidebarOpen ? "" : ""}`}
            onClick={toggleSidebar}
          >
            Toggle Sidebar
          </button> */}
        </header>
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
