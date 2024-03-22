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
                Electronic Government Procurement (eGP) refers to the use of
                digital technologies to enable a more efficient and transparent
                exchange of information, and interactions and transactions
                between government and the business community in the procurement
                of goods, services, and works. E-GP automates and streamlines
                the end-to-end public procurement process from the preparation
                and publication of annual procurement plans, managing the
                various tendering activities, and administration of contracts.
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

          <Flex direction={'column'} gap={'lg'} px="md">
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
                <Link href="#">https://www.figma.com/file/</Link>
                <Link href="#">https://www.figma.com/file/</Link>
              </Flex>
            </Flex>
          </Flex>
        </SimpleGrid>

        <Flex className="flex-col items-center justify-center mx-auto mt-12 ">
          <Text ta={'center'} fz={14}>
            Copyright © {currentYear}, Procurement and Disposal of Assets
            Authority
          </Text>
          <Flex gap={5} fw={500} className=" items-center justify-center">
            Powered By
            <div className="w-[80px] h-[40px] relative">
              <Image src={'/perago-white.png'} fill alt="perago" />
            </div>
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
