import { Box, Container, Flex, Group, Progress, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import classes from './auth-layout.module.scss';
import { AppLogo, AppBackOfficeLogo } from './app-logo';
import PeragoLogo from './perago.png';

export function PageWrapper({
  children,
  app,
}: {
  children: React.ReactNode;
  app?: 'portal' | 'bo';
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
    <Container className={classes.root} data-portal={app} fluid>
      <Box className={classes.layout}>
        <Box className={classes.leftLayout}>
          <Box className={classes.leftLayoutWrapper}>
            <Flex
              w={{
                base: 156,
                md: 200,
              }}
            >
              {app === 'bo' ? <AppBackOfficeLogo /> : <AppLogo />}
            </Flex>
            <Flex
              className="flex flex-col items-start gap-2"
              mt={10}
              visibleFrom="md"
            >
              <Text fw={700} fz={38}>
                Welcome to MANEPS
              </Text>
              <Text className="text-justify" fz={16} maw={410}>
                The Malawi National Electronic Procurement System (MANEPS)
                Platform is a web-based, collaborative system to manage the full
                life cycle of a tendering and contract management process, for
                both government agencies and suppliers.
              </Text>
              <Group gap={5} grow maw={200} mb="md" mt="xs">
                {bars}
              </Group>
            </Flex>
          </Box>
        </Box>
        <Box className={classes.rightLayout}>{children}</Box>
      </Box>

      <Flex className="w-full justify-center items-center flex-col py-2">
        <Text fz={14} ta="center">
          Copyright © {currentYear}, PPDA: Public Procurement and Disposal of
          Assets Authority
        </Text>
        <Flex fw={500} gap={5}>
          Powered By
          <Link
            className="w-[80px] h-[21px] relative"
            href="http://peragosystems.com/home"
            target="_blank"
          >
            <Image alt="perago" fill src={PeragoLogo} />
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
}
