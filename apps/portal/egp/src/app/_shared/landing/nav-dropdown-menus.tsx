'use client';
import { Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';

export const DropDownMenus = () => {
  return (
    <Menu>
      <Menu.Target>
        <Text className="cursor-pointer flex">
          More <IconChevronDown />
        </Text>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          <Link href="/egp/vendors">Vendor List</Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/egp/resources">Resources</Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/egp/cms/help">Help Center</Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/egp/cms/faq">FAQs</Link>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
