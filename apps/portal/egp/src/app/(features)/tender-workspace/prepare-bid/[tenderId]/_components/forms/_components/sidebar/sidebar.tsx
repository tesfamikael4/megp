'use client';
import React, { useCallback, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  LoadingOverlay,
  NavLink,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import styles from './sidebar.module.scss';
import { menus } from './_constants';
import { MenuLinks } from './models';
import { IconChevronDown, IconFolderOpen } from '@tabler/icons-react';
import { useTenderSpdQuery } from '@/app/(features)/vendor/_api/tender-spd';
import { BidForm } from '@/models/bid-forms.model';
import { Section, notify } from '@megp/core-fe';
import {
  useGenerateMutation,
  useLazyBidFormsQuery,
} from '@/app/(features)/tender-workspace/_api/bid-form';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';

function createNavLinks(
  links: any[] | undefined,
  currentPath: string,
  router: any,
  createQueryString: any,
  searchParams,
) {
  return links?.map((link) => (
    <UnstyledButton
      key={link.bidFormId}
      className={`${styles.mainLink} ${searchParams.get('form') === link.bidFormId && styles.activeLink}`}
      onClick={() =>
        link.bidFormId &&
        !currentPath.includes(link.bidFormId ?? '') &&
        router.push(
          currentPath +
            '?' +
            createQueryString('form', link.bidFormId as string),
        )
      }
    >
      <NavLink
        label={link?.bidForm?.title}
        key={link.bidFormId}
        className={styles.sidebarChildren}
      ></NavLink>
    </UnstyledButton>
  ));
}
function Sidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [trigger, { data: bidForms, isFetching }] = useLazyBidFormsQuery();
  const [generate, { isLoading: isGenerating }] = useGenerateMutation();
  const prepareBidContext = useContext(PrepareBidContext);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  useEffect(() => {
    if (searchParams.get('lot')) {
      trigger(searchParams.get('lot'));
    }
  }, [searchParams, trigger]);
  const onGenerate = () => {
    generate({
      lotId: searchParams.get('lot'),
      documentType: prepareBidContext?.documentType,
      password: prepareBidContext?.password,
    })
      .unwrap()
      .then(() => {
        notify('Success', 'Tender document generated successfully');
        trigger(searchParams.get('lot'));
      })
      .catch((error) => {
        notify('Error', error.data.message);
      });
  };
  return (
    <>
      <LoadingOverlay
        visible={isFetching}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {bidForms?.length > 0 ? (
        <Section title="Forms">
          {createNavLinks(
            bidForms,
            path,
            router,
            createQueryString,
            searchParams,
          )}
        </Section>
      ) : (
        <>
          <div className="w-full bg-white flex flex-col h-96 justify-center items-center">
            <IconFolderOpen className="w-32 h-16 stroke-1" />
            <p className="text-base font-semibold">no document generated</p>
            <p>
              <Button
                variant="filled"
                className="my-auto"
                loading={isGenerating}
                onClick={() => {
                  onGenerate();
                }}
              >
                {'Generate'}
              </Button>
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default Sidebar;
