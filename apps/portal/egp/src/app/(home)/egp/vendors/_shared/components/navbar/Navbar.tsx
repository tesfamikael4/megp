'use client';
import React from 'react';
import { Card, Text } from '@mantine/core';
import styles from './navbar.module.scss';
import { NavItem } from '../../types/nav-item';
import { NavLinksGroup } from './NavLinksGroup';
import { NavItemWrapper } from '../../types/nav-item';
import { IconMyBuilding } from '../customIcon';
interface Props {
  data: NavItemWrapper[];
  hidden?: boolean;
}

export const NavLinksGroupTitle: React.FC<{
  title: string;
  navItem: NavItem[];
}> = ({ title, navItem }) => {
  return (
    <>
      <Card.Section className={styles.navlinksTitleWrapper}>
        <Text className={styles.navlinksTitle}>{title}</Text>
      </Card.Section>
      {navItem.map((item, key) => (
        <NavLinksGroup key={key + item.label} {...item} />
      ))}
    </>
  );
};
export function Navbar({ data, hidden }: Props) {
  return (
    <Card className={styles.navlinkRoot} p={0}>
      {data.map((item, key) => (
        <NavLinksGroupTitle
          key={key + item.title}
          title={item.title}
          navItem={item.children}
        />
      ))}
    </Card>
  );
}
