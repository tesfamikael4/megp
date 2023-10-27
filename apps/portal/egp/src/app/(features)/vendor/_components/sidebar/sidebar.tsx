'use client';
import React from 'react';
import {
  Card,
  Box,
  Collapse,
  Flex,
  ThemeIcon,
  UnstyledButton,
  rem,
  useDirection,
  Text,
  Divider,
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  TablerIconsProps,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './sidebar.module.scss';

export interface SidebarItem {
  label: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  link?: string;
  links?: {
    label: string;
    link: string;
    displayName?: string;
  }[];
  displayName?: string;
}
export interface SidebarItemWrapper {
  title: string;
  children: SidebarItem[];
}
interface Props {
  data: SidebarItemWrapper[];
  isCollapse?: boolean;
}

export const SidebarLinksGroupTitle: React.FC<{
  title: string;
  navItem: SidebarItem[];
}> = ({ title, navItem }) => {
  return (
    <div className="p-1 flex flex-col gap-4 mt-1">
      <div className={styles.sidebarLinksTitleWrapper}>
        <Divider
          size="sm"
          className={styles.sidebarLinksTitle}
          label={title}
          labelPosition="center"
        />
        {/* <Text className={styles.sidebarLinksTitle}>{title}</Text> */}
      </div>
      {navItem.map((item, key) => (
        <SidebarLinksGroup key={key + item.label} {...item} />
      ))}
    </div>
  );
};
export function SidebarLinksGroup({
  icon: Icon,
  label,
  link,
  links,
}: SidebarItem) {
  const pathname = usePathname();
  const { dir } = useDirection();

  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(false);
  const ChevronIcon = dir === 'ltr' ? IconChevronRight : IconChevronLeft;
  const items = (hasLinks ? links : []).map((link, key) => {
    if (link.label != '') {
      return (
        <Link href={link.link} key={key + link.label}>
          <Text
            className={`${styles.sidebarLinksGroupLink}  ${
              link.link === pathname && 'bg-[--mantine-color-primary-0]'
            } hover:bg-[--mantine-color-primary-0]`}
          >
            {link.label}
          </Text>
        </Link>
      );
    } else {
      return <div key={key + link.label}></div>;
    }
  });
  return (
    <>
      {link ? (
        <Link
          href={link}
          className={`px-2  rounded-sm  ${
            link === pathname && 'bg-[--mantine-color-primary-0]'
          } hover:bg-[--mantine-color-primary-0]`}
        >
          <Flex className="items-center justify-between flex-row">
            <Flex className="items-center gap-2 flex-row">
              <ThemeIcon variant="light" size={30}>
                <Icon style={{ width: rem(18), height: rem(18) }} />
              </ThemeIcon>
              <Text className="">{label}</Text>
            </Flex>
          </Flex>
        </Link>
      ) : (
        <UnstyledButton
          onClick={() => {
            if (hasLinks) {
              setOpened((o) => !o);
              return;
            }
          }}
          className={'font-bold  text-8xl no-underline '}
        >
          <Flex
            className={`items-center justify-between px-2 py-1 rounded-sm  ${
              link === pathname.split('/')[3] &&
              'bg-[--mantine-color-primary-0]'
            } hover:bg-[--mantine-color-primary-0]`}
          >
            <Flex className="items-center gap-2">
              <ThemeIcon variant="light" size={28}>
                <Icon style={{ width: rem(18), height: rem(18) }} />
              </ThemeIcon>
              <Text className={styles.sidebarLinksLinkLabel}>{label}</Text>
            </Flex>
            {hasLinks && (
              <ChevronIcon
                size="1rem"
                stroke={1.5}
                className={`${styles.sidebarLinksGroupChevron} ${
                  opened
                    ? dir
                      ? 'rotate-[90deg]'
                      : 'rotate-[90deg]'
                    : ' transform-none'
                }
                }`}
              />
            )}
          </Flex>
        </UnstyledButton>
      )}
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
export function Sidebar({ data, isCollapse }: Props) {
  return (
    <div>
      {data.map((item, key) => (
        <SidebarLinksGroupTitle
          key={key + item.title}
          title={item.title}
          navItem={item.children}
        />
      ))}
    </div>
  );
}
