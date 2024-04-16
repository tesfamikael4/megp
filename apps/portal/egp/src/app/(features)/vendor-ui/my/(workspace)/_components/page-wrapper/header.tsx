import { Flex, Text } from '@mantine/core';
import React, { memo, PropsWithChildren } from 'react';

interface HeaderProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const PageHeader: React.FC<HeaderProps> = memo(({ title, left, right }) => {
  return (
    <Flex className=" justify-between items-center p-4 ">
      <div className="w-fit">
        <Text fw={600} fz={20} c={'primary.7'}>
          {title}
        </Text>
        {left && left}
      </div>
      <div className="w-fit">{right && right}</div>
    </Flex>
  );
});
PageHeader.displayName = 'PageHeader';
export default PageHeader;
