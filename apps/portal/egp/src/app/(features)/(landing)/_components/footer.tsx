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

export default function Footer() {
  const navigateToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002D0D] md:py-16 xs:pt-16  text-[#8C94A3] items-center justify-center">
      <Container size={'xl'} className="relative">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }} className="ml-auto">
          <Flex direction="column" gap={'md'} px="sm">
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

              <Text size="xs" className="text-[#8F9FA3] text-justify">
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
            <Flex direction={'column'} mt={18}>
              <Text className="text-white mb-2">CONTACT US</Text>
              <Flex
                columnGap={'xl'}
                className="w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <Flex direction={'column'}>
                  <Text size="xs" className="text-[#8F9FA3] mb-2">
                    +1 (999) 888-77-66
                  </Text>
                  <Text size="xs" className="text-[#8F9FA3] mb-2">
                    hello@logoipsum.com
                  </Text>
                </Flex>
                <Flex direction="column" ml={3}>
                  <Text size="xs" className="text-[#8F9FA3] mb-2">
                    Fax:+251111248612 / +251111540120
                  </Text>
                  <Text size="xs" className="text-[#8F9FA3]">
                    P.O.Box: 6217376, Addis Ababa, Ethiopia
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            {/* Location */}
            <Flex
              className="w-full  flex-col justify-center gap-4 lg:flex-row lg:items-center lg:justify-between "
              columnGap={'xl'}
            >
              <Box>
                <Text className="text-white mb-2 ">LOCATION</Text>
                <Text className="text-sm">
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
              </Box>
              <Flex direction={'column'} className="flex-auto">
                <Text className="text-white ">IMPORTANT LINKS</Text>
                <Box>
                  <SimpleGrid cols={1} className="sm:text-xs">
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                    <Link href="#">https://www.figma.com/file/</Link>
                  </SimpleGrid>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </SimpleGrid>

        <Flex className="items-center justify-center mx-auto mt-12 text-[#8e96a1]">
          <Text size="xs">
            Copyright &copy; {currentYear} All rights reserved. Powered by
            Perago Inc.
          </Text>
        </Flex>

        <Avatar
          bg="white"
          onClick={navigateToTop}
          className="absolute -top-0 right-0 cursor-pointer"
        >
          <IconArrowUp />
        </Avatar>
      </Container>
    </footer>
  );
}
