import {
  Box,
  Container,
  Flex,
  Group,
  Progress,
  SimpleGrid,
  Text,
} from '@mantine/core';
import React, { PropsWithChildren } from 'react';
import classes from './page-styles.module.scss';
import Image from 'next/image';
import { LogoWithOrg } from '@/app/(features)/(landing)/_components/logo';

const PageWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const currentYear = new Date().getFullYear();

  const bars = Array(2)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={index == 0 ? 100 : 0}
        color={'white'}
        key={index}
        size={4}
        h={6}
      />
    ));
  return (
    <Container fluid className={classes.root}>
      <SimpleGrid
        cols={{
          base: 1,
          md: 2,
          sm: 2,
          xs: 1,
        }}
        spacing={{
          xs: 0,
        }}
        className="h-full"
      >
        <Box className={classes.leftLayout}>
          <Box className={classes.leftLayoutWrapper}>
            <Flex
              align={'center'}
              gap={'xs'}
              className="sm:items-center sm:justify-center"
            >
              <LogoWithOrg />
            </Flex>
            <Flex
              mt={10}
              className="flex flex-col  gap-6 sm:items-start items-center sm:justify-center"
            >
              <Text visibleFrom="sm" fw={700} fz={38}>
                Welcome to MANEPS
              </Text>
              <Text
                fw={700}
                fz={{
                  xs: 38,
                  base: 20,
                }}
                hiddenFrom="sm"
              >
                Welcome, Sign up to MANEPS!
              </Text>
              <Text fz={16} maw={410} visibleFrom="sm" className="text-justify">
                The MANEPS Malawi Platform is a web-based, collaborative system
                to manage the full life cycle of a tendering and contract
                management process, for both government agencies and suppliers.
              </Text>
              <Group gap={5} grow mt="xs" mb="md" maw={200} visibleFrom="sm">
                {bars}
              </Group>
            </Flex>
          </Box>
        </Box>
        <Box className={classes.rightLayout}>{children}</Box>
      </SimpleGrid>
      <Flex className="w-full justify-center items-center flex-col py-2">
        <Text ta={'center'} fz={14}>
          Copyright © {currentYear}, Procurement and Disposal of Assets
          Authority
        </Text>
        <Flex gap={5} fw={500}>
          Powered By
          <div className="w-[80px] h-[21px] relative">
            <Image src={'/perago.png'} fill alt="perago" />
          </div>
        </Flex>
      </Flex>
    </Container>
  );
};

export default PageWrapper;
