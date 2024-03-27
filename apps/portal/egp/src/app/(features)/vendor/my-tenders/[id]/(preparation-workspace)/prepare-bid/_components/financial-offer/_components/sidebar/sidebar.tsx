'use client';
import React, { useCallback } from 'react';
import { Box, NavLink, Text, UnstyledButton } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './sidebar.module.scss';
import { menus } from './_constants';
import { MenuLinks } from './models';
import { IconChevronDown } from '@tabler/icons-react';

function createNavLinks(
  links: MenuLinks.SidebarLinks[] | undefined,
  currentPath: string,
  router: any,
  createQueryString: any,
  searchParams,
) {
  return links?.map((link) => (
    <Box
      key={link.label}
      className={`w-full p-2 my-2 rounded-sm ${searchParams.get('form') === link.link ? 'border border-black' : 'border border-gray-200'}`}
      onClick={() =>
        link.link &&
        !currentPath.includes(link.link ?? '') &&
        router.push(
          currentPath + '?' + createQueryString('form', link.link as string),
        )
      }
    >
      <Box>
        <NavLink
          label={link.label}
          key={link.label}
          className="text-lg font-medium"
        >
          {createNavLinks(
            link.links,
            currentPath,
            router,
            createQueryString,
            searchParams,
          )}
        </NavLink>
        <Box className="flex justify-end ">
          <Box className="w-1/4 rounded-sm bg-red-600 text-center text-sm text-white ">
            no content
          </Box>
        </Box>
      </Box>
    </Box>
  ));
}
function Sidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  return (
    <Box className="bg-white px-4 rounded-md">
      <Box className="py-4">
        <Box className="flex justify-between">
          <Text className="font-bold text-xl">Bid Submission Sheet</Text>
          <IconChevronDown />
        </Box>
        <Box>
          {createNavLinks(
            menus.bidSubmittedBy,
            path,
            router,
            createQueryString,
            searchParams,
          )}
        </Box>
      </Box>
      <Box className="py-4">
        <Box className="flex justify-between">
          <Text className="font-bold text-xl">Financial Offer</Text>
          <IconChevronDown />
        </Box>
        <Box>
          {createNavLinks(
            menus.financialOffer,
            path,
            router,
            createQueryString,
            searchParams,
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
