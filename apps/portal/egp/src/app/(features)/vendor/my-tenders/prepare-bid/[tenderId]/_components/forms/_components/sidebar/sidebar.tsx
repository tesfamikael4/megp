'use client';
import React, { useCallback, useEffect } from 'react';
import { Box, NavLink, Text, UnstyledButton } from '@mantine/core';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import styles from './sidebar.module.scss';
import { menus } from './_constants';
import { MenuLinks } from './models';
import { IconChevronDown } from '@tabler/icons-react';
import { useTenderSpdQuery } from '@/app/(features)/vendor/_api/tender-spd';
import { useLazyBidFormsQuery } from '@/app/(features)/vendor/_api/bid-form';
import { BidForm } from '@/models/bid-forms.model';
import { Section } from '@megp/core-fe';

function createNavLinks(
  links: BidForm[] | undefined,
  currentPath: string,
  router: any,
  createQueryString: any,
  searchParams,
) {
  return links?.map((link) => (
    <UnstyledButton
      key={link.title}
      className={`${styles.mainLink} ${searchParams.get('form') === link.id && styles.activeLink}`}
      onClick={() =>
        link.id &&
        !currentPath.includes(link.id ?? '') &&
        router.push(
          currentPath + '?' + createQueryString('form', link.id as string),
        )
      }
    >
      <NavLink
        label={link.title}
        key={link.title}
        className={styles.sidebarChildren}
      ></NavLink>
    </UnstyledButton>
  ));
}
function Sidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const { tenderId } = useParams();
  const { data } = useTenderSpdQuery(tenderId);
  const [trigger, { data: bidForms, isFetching }] = useLazyBidFormsQuery();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  useEffect(() => {
    if (data && data.spdId) {
      trigger({ spdId: data.spdId, collectionQuery: {} });
    }
  }, [data]);
  return (
    <>
      {bidForms && (
        <Section title="Forms">
          {createNavLinks(
            bidForms.items,
            path,
            router,
            createQueryString,
            searchParams,
          )}
        </Section>
      )}
    </>
  );
}

export default Sidebar;
