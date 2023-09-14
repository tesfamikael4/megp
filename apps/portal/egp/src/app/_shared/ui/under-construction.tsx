'use client';

import { Center } from '@mantine/core';
import Image from 'next/image';
export const UnderConstruction = () => {
  return (
    <Center>
      <Image
        src="/under_construction.png"
        alt="under construction img"
        height={500}
        width={500}
      />
    </Center>
  );
};
