'use client';
import React from 'react';
import { Box, Card, Flex, Text, createStyles, rem } from '@mantine/core';
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
      <Card.Section withBorder className={styles.navlinksTitleWrapper}>
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
    <Card className={styles.navlinkRoot} shadow="lg" p={0}>
      <Card.Section inheritPadding className="py-10 ">
        <Flex direction={'column'} align={'center'} justify={'center'}>
          <Box className=" border rounded-[50%] p-2">
            <IconMyBuilding className="w-10 h-10" />
          </Box>
          <Text size={'14px'} weight={600}>
            Registration Services
          </Text>
        </Flex>
      </Card.Section>
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
