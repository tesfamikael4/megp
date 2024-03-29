'use client';
import { Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const BidSecurity = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return <Flex>{children}</Flex>;
};

export default BidSecurity;
