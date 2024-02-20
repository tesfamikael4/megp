'use client';

import React from 'react';
import {
  SimpleGrid,
  Flex,
  Box,
  Image,
  Text,
  ActionIcon,
  Group,
  Divider,
  Container,
  Button,
  Avatar,
  Grid,
} from '@mantine/core';
import {
  IconBrandTwitterFilled,
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutubeFilled,
  IconChevronUp,
  IconDots,
  IconPointFilled,
  IconArrowNarrowUp,
  IconArrowUp,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function Footer() {
  const navigateToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002D0D] md:py-14 text-[#8C94A3] items-center">
      {/* <Avatar className="object-left" bg="white" onClick={navigateToTop}>
        <IconArrowNarrowUp />
      </Avatar> */}
      <Container size={'xl'} className="relative">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }}>
          <Flex direction="column" align={'center'} gap={'md'} px="md">
            <Group>
              <Link href="http://peragosystems.com/home">
                <Image
                  src="/ppda-svg.svg"
                  alt="logo"
                  height="32"
                  width="32"
                  className="object-contain"
                />
              </Link>

              <Text size="xs" className="text-[#8F9FA3] mb-4">
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
                  <Text
                    size="xs"
                    className="flex items-center justify-center text-white"
                  >
                    More about us <IconPointFilled />
                  </Text>
                </Link>
              </Box>
            </Group>
            <Group>
              <ActionIcon variant="subtle" radius={'lg'} bg={'white'} size="lg">
                <IconBrandFacebookFilled size={18} strokeWidth={2.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" radius={'lg'} bg={'white'} size="lg">
                <IconBrandInstagram size={18} strokeWidth={2.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" radius={'lg'} bg={'white'} size="lg">
                <IconBrandLinkedin size={18} strokeWidth={2.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" radius={'lg'} bg={'white'} size="lg">
                <IconBrandTwitterFilled size={18} strokeWidth={2.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" radius={'lg'} bg={'white'} size="lg">
                <IconBrandYoutubeFilled size={18} strokeWidth={2.5} />
              </ActionIcon>
            </Group>
            <Divider my={'xs'} />
          </Flex>

          <Flex direction={'column'} gap={'lg'} px="md">
            {/* contact us */}
            <Flex direction={'column'} className="w-full">
              <Text className="text-white mb-2">CONTACT US</Text>
              <Flex
                align={'center'}
                justify={'space-between'}
                className="w-full"
                columnGap={'xl'}
              >
                <Flex direction={'column'}>
                  <Text size="xs" className="text-[#8F9FA3] mb-2">
                    +1 (999) 888-77-66
                  </Text>
                  <Text size="xs" className="text-[#8F9FA3] mb-2">
                    hello@logoipsum.com
                  </Text>
                </Flex>
                <Flex direction="column" ml="auto">
                  <Text size="xs" className="text-[#8F9FA3] mb-2">
                    Fax:+251111248612 / +251111540120
                  </Text>
                  <Text size="xs" className="text-[#8F9FA3] mb-2">
                    P.O.Box: 6217376, Addis Ababa, Ethiopia
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            {/* Location */}
            <Flex
              rowGap={{ xs: 'md', sm: 'md' }}
              className="w-full flex-col justify-center gap-4 md:flex-row md:items-center md:justify-between"
              columnGap={'xl'}
            >
              <Box>
                <Text className="text-white mb-2">LOCATION</Text>
                <address className="text-sm">
                  Public Procurement and Disposal of Assets Authority,
                  <br />
                  The Jireh Bible House,
                  <br />
                  Area 3,Off Colby Road,
                  <br />
                  Private Bag 383,
                  <br />
                  Capital City,Lilongwe 3, Malawi
                  <br />
                  Phone: (256)0 887 083 261
                  <br />
                  Email: <a href="mailto:dg@ppda.mw">dg@ppda.mw</a>
                  <br />
                  Website: <a href="http://www.ppda.mw/">www.ppda.mw</a>
                </address>
              </Box>
              <Box>
                <Text className="text-white">IMPORTANT LINKS</Text>
                <Box>
                  <SimpleGrid
                    cols={{
                      base: 2,
                      sm: 2,
                      md: 1,
                    }}
                    className="sm:text-xs"
                  >
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                  </SimpleGrid>
                </Box>
              </Box>
            </Flex>
          </Flex>
        </SimpleGrid>

        <Flex className="items-center justify-center mx-auto mt-6 text-[#8e96a1]">
          <Text size="xs">
            Copyright &copy; {currentYear} All rights reserved. Powered by
            Perago Inc.
          </Text>
        </Flex>

        <Avatar
          bg="white"
          onClick={navigateToTop}
          className="absolute top-0 right-2 cursor-pointer"
        >
          <IconArrowUp />
        </Avatar>
      </Container>
    </footer>
  );
}
