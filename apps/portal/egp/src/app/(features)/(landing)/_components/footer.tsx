'use client';

import React from 'react';
import {
  SimpleGrid,
  Flex,
  Box,
  Text,
  ActionIcon,
  Group,
  Divider,
  Container,
  Avatar,
} from '@mantine/core';
import {
  IconBrandTwitterFilled,
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutubeFilled,
  IconPointFilled,
  IconArrowUp,
} from '@tabler/icons-react';
import Link from 'next/link';
import { LogoFooter } from './logo';
import Image from 'next/image';

export default function Footer() {
  const navigateToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" bg-[var(--mantine-color-primary-7)] xs:pt-16 text-white items-center justify-center p-4">
      <Container size={'xl'} className="relative pt-10">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }} className="ml-auto">
          <Flex direction="column" gap={'md'} px="sm">
            <Group>
              <Link href="/">
                <LogoFooter />
              </Link>

              <Text size="xs" className=" text-justify">
                The Malawi National Electronic Procurement System (MANEPS)
                Platform is a web-based, collaborative system to manage the full
                life cycle of a tendering and contract management process, for
                both government agencies and suppliers.
              </Text>
              <Box>
                <Link href="#">
                  <Text size="xs" className="flex items-center justify-center ">
                    More about us <IconPointFilled />
                  </Text>
                </Link>
              </Box>
            </Group>
            <Divider my={'xs'} />

            <Group className="items-start">
              <ActionIcon
                variant="subtle"
                color="black"
                radius={'lg'}
                bg={'white'}
                size="lg"
              >
                <IconBrandFacebookFilled size={18} strokeWidth={2.5} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="black"
                radius={'lg'}
                bg={'white'}
                size="lg"
              >
                <IconBrandInstagram size={18} strokeWidth={2.5} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="black"
                radius={'lg'}
                bg={'white'}
                size="lg"
              >
                <IconBrandLinkedin size={18} strokeWidth={2.5} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="black"
                radius={'lg'}
                bg={'white'}
                size="lg"
              >
                <IconBrandTwitterFilled size={18} strokeWidth={2.5} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="black"
                radius={'lg'}
                bg={'white'}
                size="lg"
              >
                <IconBrandYoutubeFilled size={18} strokeWidth={2.5} />
              </ActionIcon>
            </Group>
          </Flex>

          <Flex direction={'column'} gap={'xl'} px="md">
            {/* contact us */}
            <Flex direction={'column'} gap={5}>
              <Text fw={500}>CONTACT US</Text>
              <Flex direction={'column'}>
                <Text size="xs">+1 (999) 888-77-66</Text>
                <Text size="xs">hello@logoipsum.com</Text>
                <Text size="xs">Fax:+251111248612 / +251111540120</Text>
                <Text size="xs">P.O.Box: 6217376, Addis Ababa, Ethiopia</Text>
              </Flex>
            </Flex>
            <Flex direction={'column'} gap={5}>
              <Text fw={500}>LOCATION</Text>
              <Flex direction={'column'}>
                <Text fz={12}>
                  Public Procurement and Disposal of Assets Authority,
                  <br />
                  The Jireh Bible House,
                  <br />
                  Area 3,Off Colby Road,
                  <br />
                  Private Bag 383,
                  <br />
                  Capital City,Lilongwe 3, Malawi
                </Text>
              </Flex>
            </Flex>

            {/* Location */}
            <Flex direction={'column'} gap={5}>
              <Text fw={500}>IMPORTANT LINKS</Text>
              <Flex fz={12} direction={'column'}>
                <Link target="_blank" href="https://www.pppda.mw">
                  https://www.pppda.mw
                </Link>
                <Link target="_blank" href="https://www.mra.mw">
                  https://www.mra.mw
                </Link>
                <Link target="_blank" href="https://www.mbrs.gov.mw">
                  https://www.mbrs.gov.mw
                </Link>
              </Flex>
            </Flex>
          </Flex>
        </SimpleGrid>

        <Flex className="flex-col items-center justify-center mx-auto mt-12 ">
          <Text ta={'center'} fz={14}>
            Copyright © {currentYear}, PPDA: Public Procurement and Disposal of
            Assets Authority
          </Text>
          <Flex gap={5} fw={500} className=" items-center justify-center">
            Powered By
            <Link
              href="http://peragosystems.com/home"
              target="_blank"
              className="w-[80px] h-[40px] relative"
            >
              <Image src={'/perago-white.png'} fill alt="perago" />
            </Link>
          </Flex>
        </Flex>

        <Avatar
          bg="white"
          onClick={navigateToTop}
          className="absolute top-5 right-0 cursor-pointer"
        >
          <IconArrowUp />
        </Avatar>
      </Container>
    </footer>
  );
}
