'use client';
import styles from './navbar.module.scss';
import {
  Box,
  Collapse,
  Flex,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  rem,
  useDirection,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NavItem } from '../../types/nav-item';

export function NavLinksGroup({ icon: Icon, label, link, links }: NavItem) {
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
            className={`${styles.navLinksGroupLink} ${
              link.link === pathname && styles.navLinksGroupActiveLink
            }`}
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
          className={`${styles.navLinksGroupControl} ${
            link === pathname && styles.navLinksGroupActiveControl
          }`}
        >
          <Flex className="items-center justify-between">
            <Flex className="items-center gap-2">
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
          className={styles.navLinksGroupControl}
        >
          <Flex className="items-center justify-between">
            <Flex className="items-center gap-2">
              <ThemeIcon variant="light" size={30}>
                <Icon style={{ width: rem(18), height: rem(18) }} />
              </ThemeIcon>
              <Text className={styles.navlinksLinkLabel}>{label}</Text>
            </Flex>
            {hasLinks && (
              <ChevronIcon
                size="1rem"
                stroke={1.5}
                className={`${styles.navLinksGroupChevron} ${
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
