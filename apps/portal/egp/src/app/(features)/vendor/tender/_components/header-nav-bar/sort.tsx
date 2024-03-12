import { Flex, Menu, UnstyledButton } from '@mantine/core';
import React from 'react';
import styles from './sort.module.scss';
import { IconArrowDown, IconArrowUp, IconFilter } from '@tabler/icons-react';

type SortProps = {
  sortBy: string | null;
  setSortBy: (newPageSort: string) => void;
  id: number;
};

const Sort = ({ sortBy, setSortBy, id }: SortProps) => {
  return (
    <Flex className={styles.root}>
      <Menu
        shadow="lg"
        width={170}
        position="bottom-end"
        offset={13}
        withArrow
        arrowPosition="center"
      >
        <Menu.Target>
          <UnstyledButton className={styles.selection}>
            <Flex className=" items-start gap-2" fw={400} fz={14}>
              {/* <IconFilter size={16} stroke={2.1} /> */}
              {sortBy === 'asc' && <>Sort by: All Tenders</>}
              {sortBy === 'desc' && <>Sort by: DESC</>}
            </Flex>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconArrowUp size={16} />}
            fw={500}
            fz={12}
            onClick={(v) => setSortBy('asc')}
          >
            Sort by All Tenders
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};

export default Sort;
