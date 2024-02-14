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
    <footer className="bg-[#002D0D] py-7 text-[#8C94A3] items-center">
      {/* <Avatar className="object-left" bg="white" onClick={navigateToTop}>
        <IconArrowNarrowUp />
      </Avatar> */}
      <Container size={'xl'} className="relative">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Flex direction="column" px="md">
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

              <Text size="xs" className="text-gray-500 mb-4">
                Lorem ipsum dolor sit amet, consectetur lorem adipiscing elit.
                Nam hendrerit nisi sed sollicitudLorem ipsum dolor sit amet,
                consectetur lorem adipiscing elit. Nam hendrerit nisi sed
                sollicitudLorem ipsum dolor sit amet, consectetur lorem
                adipiscing elit. Nam hendrerit nisi sed sollicitudLorem ipsum
                dolor sit amet, consectetur lorem adipiscing elit. Nam hendrerit
                nisi sed sollicitudLorem ipsum dolor sit amet, consectetur lorem
                adipiscing elit. Nam hendrerit nisi sed sollicitudLorem ipsum
                dolor sit amet, consectetur lorem adipiscing elit. Nam hendrerit
                nisi sed sollicitudLorem ipsum dolor sit amet, consectetur lorem
                adipiscing elit. Nam hendrerit nisi sed sollicitud
              </Text>
              <Link href="#">
                <Text size="xs" className="flex items-center text-white">
                  More about us <IconPointFilled />
                </Text>
              </Link>

              <Divider
                className="border-white"
                style={{
                  width: '100%',
                }}
              />

              <Group>
                <ActionIcon variant="subtle" c={'white'} size="lg">
                  <IconBrandFacebookFilled size={18} strokeWidth={2.5} />
                </ActionIcon>
                <ActionIcon variant="subtle" c={'white'} size="lg">
                  <IconBrandInstagram size={18} strokeWidth={2.5} />
                </ActionIcon>
                <ActionIcon variant="subtle" c={'white'} size="lg">
                  <IconBrandLinkedin size={18} strokeWidth={2.5} />
                </ActionIcon>
                <ActionIcon variant="subtle" c={'white'} size="lg">
                  <IconBrandTwitterFilled size={18} strokeWidth={2.5} />
                </ActionIcon>
                <ActionIcon variant="subtle" c={'white'} size="lg">
                  <IconBrandYoutubeFilled size={18} strokeWidth={2.5} />
                </ActionIcon>
              </Group>
            </Group>
          </Flex>

          <Grid px="md">
            {/* contact us */}
            <h1 className="text-white mb-2">CONTACT US</h1>
            <Flex>
              <Flex direction="column">
                <Text size="xs" className="text-gray-500 mb-2">
                  +1 (999) 888-77-66
                </Text>
                <Text size="xs" className="text-gray-500 mb-2">
                  hello@logoipsum.com
                </Text>
              </Flex>
              <Flex direction="column" ml="auto">
                <Text size="xs" className="text-gray-500 mb-2">
                  Fax:+251111248612 / +251111540120
                </Text>
                <Text size="xs" className="text-gray-500 mb-2">
                  P.O.Box: 6217376, Addis Ababa, Ethiopia
                </Text>
              </Flex>
            </Flex>
            {/* Location */}
            <div>
              <h1 className="text-white mb-2">LOCATION</h1>
              <Text size="xs" className="text-gray-500 mb-2">
                FDRE Public Procurement and Property Authority 6 killo In front
                of Yekatit 12 Referral Hospital
              </Text>
            </div>
            {/* Important Links */}
            <div>
              <Flex direction="column" gap="2" className="mb-4 sm:text-xs">
                <h1 className="text-white">IMPORTANT LINKS</h1>
                <Link href="#">https://www.figma.com/file/</Link>
                <Link href="#">https://www.figma.com/file/</Link>
                <Link href="#">https://www.figma.com/file/</Link>
                <Link href="#">https://www.figma.com/file/</Link>
                <Link href="#">https://www.figma.com/file/</Link>
                <Link href="#">https://www.figma.com/file/</Link>
              </Flex>
            </div>
          </Grid>
        </SimpleGrid>

        <Flex className="items-center justify-center mx-auto mt-3 text-[#8e96a1]">
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
