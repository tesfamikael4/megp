'use client';

import {
  Container,
  Title,
  Text,
  Button,
  Flex,
  Input,
  Group,
} from '@mantine/core';
import classes from './HeroImageRight.module.css';
import { IconSearch } from '@tabler/icons-react';
import { useAuth } from '@megp/auth';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <div className={classes.root}>
      <Container size="xl">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Transform public procurement through digitalization
            </Title>
            <Text className={classes.description} mt={'md'}>
              Empower Your Business Through Electronic Public Procurement
            </Text>

            <Flex
              direction={'column'}
              rowGap={'md'}
              mt={80}
              className="w-full md:w-1/2"
            >
              <Input
                size="lg"
                placeholder="Search Tenders Here"
                leftSection={<IconSearch />}
                className="w-full flex-end"
                rightSectionWidth={100}
                rightSectionPointerEvents="all"
                visibleFrom="md"
                rightSection={
                  <Button
                    className={'rounded-none rounded-r cursor-pointer'}
                    bg={'green'}
                    size="lg"
                  >
                    Search
                  </Button>
                }
              />
              <Flex className="w-full" columnGap={'md'}>
                <Button
                  bg={'green'}
                  size="sm"
                  className="md:w-1/2"
                  onClick={() => {
                    user
                      ? router.push('/vendor/registration/new/basic')
                      : router.push('/auth/login');
                  }}
                >
                  Get Started
                </Button>
                {!user && (
                  <Button
                    bg={'transparent'}
                    variant="outline"
                    size="sm"
                    color="white"
                    className="sm:w-full md:w-1/2"
                    onClick={() => router.push('/auth/login')}
                  >
                    Login
                  </Button>
                )}
              </Flex>
            </Flex>
          </div>
        </div>
      </Container>
    </div>
  );
}
