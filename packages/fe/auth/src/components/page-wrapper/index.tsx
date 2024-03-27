import {
  Box,
  Container,
  Flex,
  Group,
  Progress,
  SimpleGrid,
  Text,
} from '@mantine/core';
import Image from 'next/image';
import classes from './auth-layout.module.scss';
import { AppLogo } from './app-logo';

export function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const currentYear = new Date().getFullYear();
  const bars = Array(2)
    .fill(0)
    .map((_, index) => (
      <Progress
        color="white"
        h={6}
        key={index}
        size={4}
        styles={{ section: { transitionDuration: '0ms' } }}
        value={index === 0 ? 100 : 0}
      />
    ));
  return (
    <Container className={classes.root} fluid>
      <SimpleGrid
        className="h-full"
        cols={{
          base: 1,
          md: 2,
          sm: 2,
        }}
      >
        <Box className={classes.leftLayout}>
          <Box className={classes.leftLayoutWrapper}>
            <Flex align="center" gap="xs">
              <AppLogo />
            </Flex>
            <Flex className="flex flex-col items-start gap-6" mt={10}>
              <Text
                fw={700}
                fz={{
                  sm: 38,
                  base: 16,
                }}
              >
                Welcome to MANEPS
              </Text>
              <Text className="text-justify" fz={16} maw={410} visibleFrom="sm">
                The MANEPS Malawi Platform is a web-based, collaborative system
                to manage the full life cycle of a tendering and contract
                management process, for both government agencies and suppliers.
              </Text>
              <Group gap={5} grow maw={200} mb="md" mt="xs">
                {bars}
              </Group>
            </Flex>
          </Box>
        </Box>
        <Box className={classes.rightLayout}>{children}</Box>
      </SimpleGrid>
      <Flex className="w-full justify-center items-center flex-col py-2">
        <Text fz={14} ta="center">
          Copyright © {currentYear}, Procurement and Disposal of Assets
          Authority
        </Text>
        <Flex fw={500} gap={5}>
          Powered By
          <div className="w-[80px] h-[21px] relative">
            <Image alt="perago" fill src="/perago.png" />
          </div>
        </Flex>
      </Flex>
    </Container>
  );
}
